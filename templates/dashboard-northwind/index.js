const theme = sessionStorage.getItem('theme') || 'light';
let stickySideBar = sessionStorage.getItem('stickySideBar'),
    boxed = sessionStorage.getItem('boxed'),
    DOMContentLoaded = false,
    collapsed = false,
    autoCollapsed = false,
    programmaticTreeItemSelection = false,
    primaryContainer, sideBar, treeNavigation, secondaryContainer, toggleStickySidebar, toggleCollapsedSidebar, toggleBoxedLayout;

stickySideBar = !stickySideBar || stickySideBar === 'false' ? false : true;
boxed = !boxed || boxed === 'false' ? false : true;

function getTheme() {
    return document.body.getAttribute('theme');
}

window.getTheme = getTheme;

function updateTheme(theme) {
    const jqxEditor = document.querySelector('.jqx-editor.jqx-widget');

    document.body.setAttribute('theme', theme);
    Array.from(document.querySelectorAll('smart-chart')).forEach(chart => chart.theme = theme);

    if (jqxEditor) {
        $(jqxEditor).jqxEditor('theme', theme);
    }

    sessionStorage.setItem('theme', theme);
}

window.updateTheme = updateTheme;

function addTodayMenuOpenHandlers() {
    const todayMenu = document.getElementById('todayMenu');

    Array.from(document.querySelectorAll('.settings-button')).forEach(button => {
        button.addEventListener('pointerup', function (event) {
            event.stopPropagation();
        });

        button.addEventListener('click', function () {
            const rect = button.getBoundingClientRect();

            Array.from(document.getElementsByTagName('smart-menu')).
                filter(menu => menu !== todayMenu).forEach(menu => menu.close());

            if (!todayMenu.opened) {
                todayMenu.open(rect.right - todayMenu.offsetWidth, rect.bottom + window.scrollY);
            }
            else {
                todayMenu.close();
            }
        });
    });
}

window.addTodayMenuOpenHandlers = addTodayMenuOpenHandlers;

function selectTreeItem(path) {
    const respectiveAnchor = treeNavigation.querySelector('a[href="' + path + '"');

    if (respectiveAnchor) {
        let respectiveTreeItem = respectiveAnchor.closest('smart-tree-item');

        programmaticTreeItemSelection = true;
        respectiveTreeItem.selected = true;

        while (respectiveTreeItem) {
            respectiveTreeItem = respectiveTreeItem.parentItem;
            treeNavigation.expandItem(respectiveTreeItem, false);
        }

        programmaticTreeItemSelection = false;
    }
}

window.selectTreeItem = selectTreeItem;

function collapseOnWindowResize() {
    if (!DOMContentLoaded) {
        return;
    }

    const windowWidth = window.innerWidth;

    sideBar.style.transition = 'none';
    secondaryContainer.style.transition = 'none';

    if (!collapsed && windowWidth < 768) {
        collapsed = true;
        autoCollapsed = true;
    }
    else if (autoCollapsed && windowWidth >= 768) {
        collapsed = false;
        autoCollapsed = false;
    }

    primaryContainer.classList.toggle('collapsed', collapsed);

    if (collapsed) {
        toggleCollapsedSidebar.setAttribute('checked', '');
    }
    else {
        toggleCollapsedSidebar.removeAttribute('checked');
    }

    requestAnimationFrame(() => {
        sideBar.style.transition = null;
        secondaryContainer.style.transition = null;
    });
}

window.collapseOnWindowResize = collapseOnWindowResize;

function setStickySideBar() {
    stickySideBar = !stickySideBar;
    primaryContainer.classList.toggle('sticky-sidebar', stickySideBar);
    sessionStorage.setItem('stickySideBar', stickySideBar);
}

window.setStickySideBar = setStickySideBar;

function setBoxed() {
    boxed = !boxed;
    document.body.classList.toggle('boxed', boxed);
    sessionStorage.setItem('boxed', boxed);
}

window.setBoxed = setBoxed;

function checkForBody() {
    if (document.body) {
        DOMContentLoaded = true;
        primaryContainer = document.getElementById('primaryContainer');
        sideBar = document.getElementById('sideBar');
        treeNavigation = document.getElementById('tree');
        secondaryContainer = document.getElementById('secondaryContainer');
        toggleStickySidebar = document.getElementById('toggleStickySidebar');
        toggleCollapsedSidebar = document.getElementById('toggleCollapsedSidebar');
        toggleBoxedLayout = document.getElementById('toggleBoxedLayout');

        document.body.setAttribute('theme', theme);
        document.body.classList.toggle('boxed', boxed);
        primaryContainer.classList.toggle('sticky-sidebar', stickySideBar);

        if (stickySideBar) {
            toggleStickySidebar.setAttribute('checked', '');
        }

        if (boxed) {
            toggleBoxedLayout.setAttribute('checked', '')
        }

        collapseOnWindowResize();
    }
    else {
        requestAnimationFrame(checkForBody);
    }
}

window.checkForBody = checkForBody;

requestAnimationFrame(checkForBody);

window.onload = function () {
    const messagesButton = document.getElementById('messages'),
        notificationsButton = document.getElementById('notifications'),
        languageButton = document.getElementById('language'),
        profileButton = document.getElementById('profile'),
        settingsButton = document.getElementById('settingsButton'),
        settingsPanel = document.getElementById('settingsPanel'),
        settingsCloseButton = document.getElementById('settingsCloseButton'),
        lightThemePreview = document.getElementById('lightThemePreview'),
        darkThemePreview = document.getElementById('darkThemePreview'),
        buyButton = document.getElementById('buy');

    document.getElementById('toggleButton').addEventListener('click', function () {
        collapsed = !collapsed;
        autoCollapsed = false;

        primaryContainer.classList.toggle('collapsed', collapsed);
        toggleCollapsedSidebar.checked = collapsed;
    });

    [messagesButton, notificationsButton, languageButton, profileButton].forEach(button => {
        const respectiveMenu = document.getElementById(button.id + 'Menu');

        button.addEventListener('pointerup', function (event) {
            event.stopPropagation();
        });

        button.addEventListener('click', function () {
            const rect = button.getBoundingClientRect();

            Array.from(document.getElementsByTagName('smart-menu')).
                filter(menu => menu !== respectiveMenu).forEach(menu => menu.close());

            if (!respectiveMenu.opened) {
                respectiveMenu.open(rect.right - respectiveMenu.offsetWidth, rect.bottom + window.scrollY);
            }
            else {
                respectiveMenu.close();
            }
        });

        respectiveMenu.addEventListener('pointerup', function (event) {
            if (event.target.closest('[template-applied]')) {
                respectiveMenu.close();
            }
        });
    });

    settingsButton.addEventListener('click', function () {
        document.body.classList.toggle('settings-panel-shown');
    });

    document.body.addEventListener('click', function (event) {
        if (document.body.classList.contains('settings-panel-shown') &&
            !settingsPanel.contains(event.target) &&
            !settingsButton.contains(event.target)) {
            document.body.classList.remove('settings-panel-shown');
        }
    });

    settingsCloseButton.addEventListener('click', function () {
        document.body.classList.remove('settings-panel-shown');
    });

    toggleStickySidebar.addEventListener('change', function () {
        setStickySideBar();
    });

    toggleCollapsedSidebar.addEventListener('change', function (event) {
        if (event.detail.changeType === 'pointer') {
            collapsed = !collapsed;
            autoCollapsed = false;

            primaryContainer.classList.toggle('collapsed', collapsed);
        }
    });

    toggleBoxedLayout.addEventListener('change', function () {
        setBoxed();
    });

    lightThemePreview.addEventListener('click', function () {
        updateTheme('light');
    });

    darkThemePreview.addEventListener('click', function () {
        updateTheme('dark');
    });

    buyButton.addEventListener('click', function () {
        window.open('https://www.htmlelements.com/license/', '_blank');
    });

    treeNavigation.addEventListener('change', function (event) {
        if (programmaticTreeItemSelection) {
            return;
        }

        const anchor = event.detail.item.querySelector('a');

        if (anchor) {
            anchor.click();
        }
    });

    setupRouting();
};

window.onresize = collapseOnWindowResize;