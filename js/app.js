$(document).ready(function () {
    let currentSort = {field: 'name', ascending: true};
    let gamesData = [];

    function fetchGamesData() {
        return $.getJSON('games.json', function(data) {
            gamesData = data;
            $.getJSON('games_todo.json', function(data2) {
                gamesData = gamesData.concat(data2);
                init();
            });
        });
    }

    function renderTable(games) {
        const tableBody = $('#gameTable');
        tableBody.empty();

        games.forEach(game => {
            tableBody.append(`
                <tr>
                    <td>${game.name}</td>
                    <td>${game.year}</td>
                    <td>${getStatusName(game.status)}</td>
                </tr>
            `);
        });
    }

    function getStatusName(status) {
        switch (status) {
            case 'completed': return 'Пройшов';
            case 'played': return 'Грав';
            case 'planned': return 'Планую пройти';
            default: return '';
        }
    }

    function sortGames(games, field, ascending) {
        return games.sort((a, b) => {
            if (a[field] > b[field]) return ascending ? 1 : -1;
            if (a[field] < b[field]) return ascending ? -1 : 1;
            return 0;
        });
    }

    function filterGames(games, nameSearch, yearFilter, statusFilter) {
        return games.filter(game => {
            const matchesName = game.name.toLowerCase().includes(nameSearch.toLowerCase());
            const matchesYear = yearFilter ? game.year == yearFilter : true;
            const matchesStatus = statusFilter ? game.status === statusFilter : true;
            return matchesName && matchesYear && matchesStatus;
        });
    }

    function updateTable() {
        const nameSearch = $('#nameSearch').val();
        const yearFilter = $('#yearFilter').val();
        const statusFilter = $('#statusFilter').val();
        let filteredGames = filterGames(gamesData, nameSearch, yearFilter, statusFilter);
        filteredGames = sortGames(filteredGames, currentSort.field, currentSort.ascending);
        renderTable(filteredGames);
        updateSortIndicators();
    }

    function populateYearFilter() {
        const years = [...new Set(gamesData.map(game => game.year))].sort((a, b) => b - a);
        const yearFilter = $('#yearFilter');
        yearFilter.empty();
        yearFilter.append('<option value="">Всі роки</option>');
        years.forEach(year => {
            yearFilter.append(`<option value="${year}">${year}</option>`);
        });
    }

    function updateSortIndicators() {
        $('.sortable').removeClass('asc desc');
        const sortColumn = currentSort.field === 'name' ? '#sortByName' :
            currentSort.field === 'year' ? '#sortByYear' :
                '#sortByStatus';
        $(sortColumn).addClass(currentSort.ascending ? 'asc' : 'desc');
    }

    function init() {
        populateYearFilter();
        updateTable();

        $('#nameSearch').on('input', updateTable);
        $('#yearFilter').on('change', updateTable);
        $('#statusFilter').on('change', updateTable);

        $('#sortByName').on('click', function () {
            currentSort.field = 'name';
            currentSort.ascending = !currentSort.ascending;
            updateTable();
        });

        $('#sortByYear').on('click', function () {
            currentSort.field = 'year';
            currentSort.ascending = !currentSort.ascending;
            updateTable();
        });

        $('#sortByStatus').on('click', function () {
            currentSort.field = 'status';
            currentSort.ascending = !currentSort.ascending;
            updateTable();
        });
    }

    fetchGamesData();
});
