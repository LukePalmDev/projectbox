const routes = {
  home: 'view-home',
  'xbox-original': 'view-xbox-original',
  'xbox-360': 'view-xbox-360',
  'xbox-one': 'view-xbox-one',
  'xbox-series': 'view-xbox-series',
};

let currentRoute = null;

const routeLinkSelector = 'a[data-route]';

function getRouteFromHash() {
  const hash = window.location.hash.replace('#', '');
  return Object.prototype.hasOwnProperty.call(routes, hash) ? hash : null;
}

function setActiveNav(route) {
  const navLinks = document.querySelectorAll('.nav-links a[data-route]');
  navLinks.forEach((link) => {
    link.classList.toggle('active', link.dataset.route === route);
  });
}

function bindRouteLinks(scope = document) {
  scope.querySelectorAll(routeLinkSelector).forEach((link) => {
    if (link.dataset.routeBound) {
      return;
    }

    link.addEventListener('click', (event) => {
      const route = link.dataset.route;
      if (!route || !routes[route]) {
        return;
      }

      event.preventDefault();
      if (route === currentRoute) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      window.location.hash = route;
    });

    link.dataset.routeBound = 'true';
  });
}

function renderRoute(route) {
  const templateId = routes[route];
  const template = document.getElementById(templateId);

  if (!template) {
    return;
  }

  const fragment = template.content.cloneNode(true);
  const mainRoot = document.getElementById('view-root');
  const footerRoot = document.getElementById('footer-root');

  const templateMain = fragment.querySelector('main');
  const templateFooter = fragment.querySelector('footer');

  if (templateMain) {
    const mainChildren = Array.from(templateMain.children);
    mainRoot.replaceChildren(...mainChildren);
  } else {
    const nodes = Array.from(fragment.children).filter((node) => node.tagName !== 'FOOTER');
    mainRoot.replaceChildren(...nodes);
  }

  if (templateFooter && footerRoot) {
    footerRoot.className = templateFooter.className || '';
    footerRoot.innerHTML = templateFooter.innerHTML;
  } else if (footerRoot) {
    footerRoot.className = '';
    footerRoot.innerHTML = '';
  }

  bindRouteLinks(mainRoot);
  if (footerRoot) {
    bindRouteLinks(footerRoot);
  }

  currentRoute = route;
  setActiveNav(route);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function handleInitialAnchor(hash) {
  if (!hash || routes[hash]) {
    return;
  }

  const target = document.getElementById(hash);
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  bindRouteLinks();

  let initialRoute = getRouteFromHash();
  if (!initialRoute) {
    initialRoute = 'home';
    if (!window.location.hash) {
      window.location.replace(`#${initialRoute}`);
    }
  }

  renderRoute(initialRoute);
  handleInitialAnchor(window.location.hash.replace('#', ''));
});

window.addEventListener('hashchange', () => {
  const route = getRouteFromHash();
  if (!route) {
    handleInitialAnchor(window.location.hash.replace('#', ''));
    return;
  }

  if (route === currentRoute) {
    return;
  }

  renderRoute(route);
});
