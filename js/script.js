document.addEventListener('DOMContentLoaded', () => {
    const jsonContent = document.getElementById('json-content');
    const totalCountTopElement = document.getElementById('total-count-top'); // 件数表示用の要素（上部）を取得
    const totalCountBottomElement = document.getElementById('total-count-bottom'); // 件数表示用の要素（下部）を取得
    const controls = document.getElementById('controls');
    const orderSelect = document.getElementById('order-select');
    const currentSortElement = document.getElementById('current-sort');
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const paginationElement = document.getElementById('pagination');
    const pageInfoTopElement = document.getElementById('page-info-top'); // ページ情報表示用の要素（上部）を取得
    const pageInfoBottomElement = document.getElementById('page-info-bottom'); // ページ情報表示用の要素（下部）を取得
    const pageSelectElement = document.getElementById('page-select'); // ページジャンプ用のプルダウンメニューを取得

    const ITEMS_PER_PAGE = 100;
    let currentPage = 1;

    // 読み込むJSONファイルのリスト
    const jsonFiles = [
        'processed-all-shorts.json',
        'processed-all-streams.json',
        'processed-all-videos.json',
        'processed-from-membership.json'
    ];

    // fetchリクエストを作成
    const fetchPromises = jsonFiles.map(file => fetch(`archives/${file}`).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json().then(data => ({ file, data }));
    }));

    let fileDataMap = {};
    let currentSortCriteria = 'startAt';
    let isAscending = true; // 昇順か降順かを示すフラグ
    let searchWords = [];
    let searchType = 'and';

    // 全てのfetchリクエストが完了するのを待つ
    Promise.all(fetchPromises)
        .then(results => {
            console.log(results); // コンソールに表示

            // JSONデータをマップに格納
            results.forEach(({ file, data }) => {
                fileDataMap[file] = data;
            });

            // 初期表示は日付順
            sortAndDisplay(currentSortCriteria);
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });

    // ソートと表示を行う関数
    function sortAndDisplay(criteria, resetPage = true) {
        if (resetPage) currentPage = 1;

        const selectedFiles = Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.getAttribute('data-file'));
        let combinedData = selectedFiles.flatMap(file => fileDataMap[file] || []);

        // 検索フィルタを適用
        if (searchWords.length > 0) {
            combinedData = combinedData.filter(item => {
                const title = item.title || '';
                if (searchType === 'and') {
                    return searchWords.every(word => title.includes(word));
                } else {
                    return searchWords.some(word => title.includes(word));
                }
            });
        }

        combinedData.sort((a, b) => {
            let valueA, valueB;

            switch (criteria) {
                case 'startAt':
                    valueA = new Date(a.time?.startAt);
                    valueB = new Date(b.time?.startAt);
                    break;
                case 'viewCount':
                    valueA = a.statistics?.viewCount || 0;
                    valueB = b.statistics?.viewCount || 0;
                    break;
                case 'duration':
                    valueA = a.time?.duration || 0;
                    valueB = b.time?.duration || 0;
                    break;
                case 'likeCount':
                    valueA = a.statistics?.likeCount || 0;
                    valueB = b.statistics?.likeCount || 0;
                    break;
                case 'commentCount':
                    valueA = a.statistics?.commentCount || 0;
                    valueB = b.statistics?.commentCount || 0;
                    break;
                default:
                    return 0;
            }

            return isAscending ? valueA - valueB : valueB - valueA;
        });

        displayData(combinedData);
        updateCurrentSortDisplay();
    }

    // JSONデータをHTMLに表示するための関数
    function displayData(dataArray) {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        const paginatedData = dataArray.slice(startIndex, endIndex);

        let htmlContent = '<ul>';
        paginatedData.forEach((item, index) => {
            // 各プロパティの存在を確認
            const title = item.title || 'タイトルなし';
            const id = item.id || 'IDなし';
            const description = item.description || '説明なし';
            const commentCount = item.statistics?.commentCount || 'コメント数なし';
            const likeCount = item.statistics?.likeCount || 'いいね数なし';
            const viewCount = item.statistics?.viewCount || '視聴回数なし';
            const url = item.url || '#';

            // サムネイル画像のURLを確認し、存在しない場合はプレースホルダー画像を使用
            const thumbnailUrl = item.thumbnails?.high?.url || 'https://via.placeholder.com/480x360?text=No+Image';

            // startAtを日時の表記に変換
            const startAt = item.time?.startAt ? new Date(item.time.startAt).toLocaleString() : '開始日時なし';

            // durationを時分秒に変換
            const duration = item.time?.duration ? convertDuration(item.time.duration) : '継続時間なし';

            const itemNumber = startIndex + index + 1; // アイテム番号を計算

            htmlContent += `
            <li id="${id}">
                <div class="img"><img src="${thumbnailUrl}" alt="${title}"></div>
                <div class="txt">
                    <h2>${itemNumber}. ${title}</h2>
                    <div class="status1">
                        <p><strong>日時:</strong> ${startAt}</p>
                        <p><strong>動画の時間:</strong> ${duration}</p>
                    </div>
                    <div class="status2">
                        <p><strong>視聴回数:</strong> ${viewCount}</p>
                        <p><strong>コメント数:</strong> ${commentCount}</p>
                        <p><strong>いいね数:</strong> ${likeCount}</p>
                    </div>
                    <p><strong>URL:</strong> <a href="${url}" target="_blank">${url}</a></p>
                    <button class="accordion">概要欄を表示</button>
                    <div class="panel">
                        <p>${description}</p>
                    </div>
                </div>
            </li>
            `;
        });
        htmlContent += '</ul>';
        jsonContent.innerHTML = htmlContent;

        // 全体の件数を更新
        totalCountTopElement.textContent = `該当件数: ${dataArray.length}件`;
        totalCountBottomElement.textContent = `該当件数: ${dataArray.length}件`;

        // ページネーションを更新
        updatePagination(dataArray.length);

        // アコーディオンのイベントリスナーを設定
        const accordions = document.querySelectorAll('.accordion');
        accordions.forEach(accordion => {
            accordion.addEventListener('click', function() {
                this.classList.toggle('active');
                const panel = this.nextElementSibling;
                if (panel.style.display === 'block') {
                    panel.style.display = 'none';
                } else {
                    panel.style.display = 'block';
                }
            });
        });
    }

    // ページング時にページ上部にスクロールする関数
    function scrollToTop() {
        const currentSortElement = document.getElementById('current-sort');
        currentSortElement.scrollIntoView();
    }

    // 継続時間を時分秒に変換する関数
    function convertDuration(durationInSeconds) {
        const hours = Math.floor(durationInSeconds / 3600);
        const minutes = Math.floor((durationInSeconds % 3600) / 60);
        const seconds = durationInSeconds % 60;
        return `${hours}時間${minutes}分${seconds}秒`;
    }

    // 現在のソート基準と順序を表示する関数
    function updateCurrentSortDisplay() {
        const sortOrder = isAscending ? '昇順' : '降順';
        const sortCriteriaText = {
            startAt: '日付順',
            viewCount: '視聴回数順',
            duration: '継続時間順',
            likeCount: 'いいね数順',
            commentCount: 'コメント数順'
        }[currentSortCriteria];
        currentSortElement.textContent = `現在の順番: ${sortCriteriaText} (${sortOrder})`;
    }

    // ページネーションを更新する関数
    function updatePagination(totalItems) {
        const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
        let paginationContent = '';

        paginationContent += `<button class="prev" ${currentPage === 1 ? 'disabled' : ''}>前のページ</button>`;

        for (let i = 1; i <= totalPages; i++) {
            paginationContent += `<button class="${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
        }

        paginationContent += `<button class="next" ${currentPage === totalPages ? 'disabled' : ''}>次のページ</button>`;

        paginationElement.innerHTML = paginationContent;

        // ページネーションボタンのイベントリスナーを設定
        const pageButtons = paginationElement.querySelectorAll('button[data-page]');
        pageButtons.forEach(button => {
            button.addEventListener('click', () => {
                currentPage = parseInt(button.getAttribute('data-page'));
                sortAndDisplay(currentSortCriteria, false);
                scrollToTop(); // ページ上部にスクロール
            });
        });

        // 前に戻る・次に進むボタンのイベントリスナーを設定
        const prevButton = paginationElement.querySelector('.prev');
        const nextButton = paginationElement.querySelector('.next');

        if (prevButton) {
            prevButton.addEventListener('click', () => {
                if (currentPage > 1) {
                    currentPage--;
                    sortAndDisplay(currentSortCriteria, false);
                    scrollToTop(); // ページ上部にスクロール
                }
            });
        }

        if (nextButton) {
            nextButton.addEventListener('click', () => {
                if (currentPage < totalPages) {
                    currentPage++;
                    sortAndDisplay(currentSortCriteria, false);
                    scrollToTop(); // ページ上部にスクロール
                }
            });
        }

        // ページ情報を更新
        const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1;
        const endItem = Math.min(currentPage * ITEMS_PER_PAGE, totalItems);
        const pageInfoText = `全${totalPages}ページ中${currentPage}ページ目 (${startItem}件目〜${endItem}件目を表示)`;

        pageInfoTopElement.textContent = pageInfoText;
        pageInfoBottomElement.textContent = pageInfoText;

        // ページジャンプ用のプルダウンメニューを更新
        updatePageSelect(totalPages);

        // チェックボックスが全て外れている場合、次のページのボタンとpage-selectを非活性にする
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        const anyChecked = Array.from(checkboxes).some(cb => cb.checked);

        if (!anyChecked) {
            const nextButton = paginationElement.querySelector('.next');
            if (nextButton) {
                nextButton.disabled = true;
            }
            pageSelectElement.disabled = true;
        } else {
            pageSelectElement.disabled = false;
        }
    }

    // ページジャンプ用のプルダウンメニューを更新する関数
    function updatePageSelect(totalPages) {
        let pageSelectContent = '';

        for (let i = 1; i <= totalPages; i++) {
            pageSelectContent += `<option value="${i}" ${i === currentPage ? 'selected' : ''}>${i}</option>`;
        }

        pageSelectElement.innerHTML = pageSelectContent;

        // ページジャンプのイベントリスナーを設定
        pageSelectElement.addEventListener('change', () => {
            currentPage = parseInt(pageSelectElement.value);
            sortAndDisplay(currentSortCriteria, false);
            scrollToTop(); // ページ上部にスクロール
        });
    }

    // ソートボタンのイベントリスナーを設定
    controls.addEventListener('click', (event) => {
        const sortCriteria = event.target.getAttribute('data-sort');
        if (sortCriteria) {
            currentSortCriteria = sortCriteria;
            sortAndDisplay(currentSortCriteria);

            // ソートボタンの色を更新
            const sortButtons = document.querySelectorAll('#sort button');
            sortButtons.forEach(button => {
                if (button.getAttribute('data-sort') === sortCriteria) {
                    button.classList.add('active');
                } else {
                    button.classList.remove('active');
                }
            });
        }
    });

    // 昇順・降順の切り替えプルダウンのイベントリスナーを設定
    orderSelect.addEventListener('change', () => {
        isAscending = orderSelect.value === 'asc';
        sortAndDisplay(currentSortCriteria);
    });

    // チェックボックスのイベントリスナーを設定
    controls.addEventListener('change', (event) => {
        if (event.target.type === 'checkbox') {
            sortAndDisplay(currentSortCriteria);
        }
    });

    // 検索ボタンのイベントリスナーを設定
    searchButton.addEventListener('click', () => {
        const searchInputValue = searchInput.value.trim();
        searchWords = searchInputValue.split(/\s+/); // 半角スペースと全角スペースで区切る
        searchType = document.querySelector('input[name="search-type"]:checked').value;
        sortAndDisplay(currentSortCriteria);
    });
});