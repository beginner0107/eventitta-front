module.exports = {
  eventitta: {
    input: './docs/eventitta.json',
    output: {
      target: './src/api/eventitta.ts',
      client: 'react-query',
      httpClient: 'axios',
      override: {
        mutator: { path: './src/lib/axios-instance.ts', name: 'axiosInstance' },
      },
    },
  },
};