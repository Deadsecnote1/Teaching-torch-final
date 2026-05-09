import purgecss from '@fullhuman/postcss-purgecss';

export default {
  plugins: [
    purgecss({
      content: ['./index.html', './src/**/*.{jsx,js}'],
      defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
      safelist: {
        standard: [
          'html', 'body', 'App', 
          /^navbar/, /^nav-/, /^dropdown-/, 
          /^btn-/, /^modal-/, /^card-/, 
          /^badge-/, /^alert-/, /^spinner-/,
          /^row/, /^col-/, /^container/,
          /^p-/, /^m-/, /^d-/, /^bg-/, /^text-/,
          /^align-/, /^justify-/, /^border-/, /^rounded-/
        ],
        deep: [/modal$/, /dropdown$/],
        greedy: [/active$/, /show$/]
      }
    })
  ]
};
