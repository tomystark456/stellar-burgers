const path = require('path');

module.exports = ({ config }) => {
  // Добавляем поддержку TypeScript
  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    use: [
      {
        loader: require.resolve('ts-loader'),
        options: {
          transpileOnly: true,
        },
      },
    ],
  });

  // Добавляем расширения файлов
  config.resolve.extensions.push('.ts', '.tsx');

  // Добавляем алиасы
  config.resolve.alias = {
    ...config.resolve.alias,
    '@pages': path.resolve(__dirname, '../src/pages'),
    '@components': path.resolve(__dirname, '../src/components'),
    '@ui': path.resolve(__dirname, '../src/components/ui'),
    '@ui-pages': path.resolve(__dirname, '../src/components/ui/pages'),
    '@utils-types': path.resolve(__dirname, '../src/utils/types'),
    '@api': path.resolve(__dirname, '../src/utils/burger-api.ts'),
    '@slices': path.resolve(__dirname, '../src/services/slices'),
    '@selectors': path.resolve(__dirname, '../src/services/selectors')
  };

  return config;
}; 