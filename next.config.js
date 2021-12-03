module.exports = ({
  async redirects() {
    return [
      {
        source: '/',
        destination: '/jobs/',
        permanent: true,
      },
    ]
  },
  publicRuntimeConfig: {
    APP_NAME: 'Gamesmith',
    API: 'https://jobs-api.gamesmith.com/api',
    PRODUCTION: true,
    DOMAIN: 'https://jobs.gamesmith.com',
  }
})
