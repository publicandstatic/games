$(document).ready(function () {
    let currentSort = {field: null, ascending: true};
    let gamesData = [];

    function fetchGamesData() {
        return $.getJSON('games.json', function(data) {
            let gamesFromJson = data.reverse();
            $.getJSON('games_todo.json', function(data2) {
                gamesData = gamesFromJson.concat(data2);
                init();
            });
        });
    }

    function renderTable(games) {
        const tableBody = $('#gameTable');
        tableBody.empty();

        games.forEach(game => {
            tableBody.append(`
                <tr class="row-${game.status}">
                    <td>${game.name}</td>
                    <td>${game.year}</td>
                    <td>${getStatusName(game.status)}</td>
                </tr>
            `);
        });
    }

    function getStatusName(status) {
        switch (status) {
            case 'completed': return 'Пройдено';
            case 'played': return 'Зіграно';
            case 'planned': return 'Заплановано';
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
        if (currentSort.field) {
            filteredGames = sortGames(filteredGames, currentSort.field, currentSort.ascending);
        }
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
        if (currentSort.field) {
            const sortColumn = currentSort.field === 'name' ? '#sortByName' :
                currentSort.field === 'year' ? '#sortByYear' :
                    currentSort.field === 'status' ? '#sortByStatus' : '';

            // Додаємо класи для відображення напрямку сортування
            if (sortColumn) {
                $(sortColumn).addClass(currentSort.ascending ? 'asc' : 'desc');
            }
        }
    }

    let counterPassed = 0;
    let counterPlayed = 0;
    function init() {
        gamesData.forEach(game => {
            if (game.status == 'completed') {
                counterPassed++;
            } else if (game.status == 'played') {
                counterPlayed++;
            }
        });

        $('#count-played').text(counterPlayed + counterPassed);
        $('#count-passed').text(counterPassed);

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

var canvas = document.getElementById('background-сanvas');
var context = canvas.getContext('2d');
var colors = ["#00bfcb", "#18d3bc", "#5b82c8", "#3396cf"];
var fps = 15;
var now;
var then = Date.now();
var num = 2;
var delta;
var tamanho = 50;
var ismobile = false;
var varpi = 2 * Math.PI;
var interval = 1000/fps;
var objforDraw = new Array();

document.addEventListener("DOMContentLoaded", function() {
    window.requestAnimFrame = (function() {
        return window.requestAnimationFrame || window
                .webkitRequestAnimationFrame || window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
            function(callback) {
                return window.setTimeout(callback,
                    1000 / fps)
            }
    })();
    window.cancelRequestAnimFrame = (function() {
        return window.cancelAnimationFrame || window.webkitCancelRequestAnimationFrame ||
            window.mozCancelRequestAnimationFrame ||
            window.oCancelRequestAnimationFrame ||
            window.msCancelRequestAnimationFrame ||
            clearTimeout
    })();
    var ShadowObject = function(color) {
        this.x = ((Math.random() * canvas.width) + 10);
        this.y = ((Math.random() * canvas.height) + 10);
        this.color = color;
        this.size = tamanho;
        this.dirX = Math.random() < 0.5 ? -1 : 1;
        this.dirY = Math.random() < 0.5 ? -1 : 1;
        this.checkIsOut = function() {
            if ((this.x > canvas.width + (this.size /
                2)) || (this.x < 0 - (this.size /
                2))) {
                this.dirX = this.dirX * -1
            };
            if ((this.y > canvas.height + (this.size /
                2)) || (this.y < 0 - (this.size /
                2))) {
                this.dirY = this.dirY * -1
            }
        };
        this.move = function() {

            this.x += this.dirX*2;
            this.y += this.dirY*2

        }
    };

    function draw() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        var len = objforDraw.length;
        for (i = 0; i < len; i++) {
            context.beginPath();
            context.arc(objforDraw[i].x, objforDraw[i].y, objforDraw[i].size, 0, varpi, false);
            context.fillStyle = objforDraw[i].color;
            context.shadowColor = objforDraw[i].color;
            if(ismobile == false){
                context.shadowBlur = 50;
                context.shadowOffsetX = 0;
                context.shadowOffsetY = 0;
            }
            context.fill();
            objforDraw[i].checkIsOut();
            objforDraw[i].move()
        }
    };

    function animloop() {
        requestAnimFrame(animloop);
        now = Date.now();
        delta = now - then;
        if (delta > interval) {
            draw();
            then = now - (delta % interval)
        }
    };
    document.body.onload = function(e) {
        for (i = 0; i < colors.length * num; i++) {
            var color = ((i >= colors.length) ? colors[(i -
                colors.length)] : colors[i]);
            objforDraw.push(new ShadowObject(color))
        };
        animloop()
    };
});
