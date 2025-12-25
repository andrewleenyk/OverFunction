/* global React, ReactDOM */
(function () {
  const { createElement } = React;

  function AppHeader() {
    return createElement(
      'header',
      { className: 'header' },
      [
        createElement('h1', { className: 'site-title' }, 'OverFunction'),
        createElement(
          'p',
          { className: 'tagline' },
          'An ultra-minimal space to curate ideas and art.'
        ),
      ]
    );
  }

  function EmptyGallery() {
    return createElement(
      'section',
      { className: 'gallery' },
      createElement('div', { className: 'placeholder' }, 'Curations coming soon.')
    );
  }

  function AppFooter() {
    const year = new Date().getFullYear();
    return createElement('footer', { className: 'footer' }, `© ${year} OverFunction`);
  }

  function App() {
    return createElement(
      'main',
      { className: 'container' },
      [
        createElement(AppHeader),
        createElement(EmptyGallery),
        createElement(AppFooter),
      ]
    );
  }

  const rootElement = document.getElementById('root');
  const root = ReactDOM.createRoot(rootElement);
  root.render(createElement(React.StrictMode, null, createElement(App)));
})();


