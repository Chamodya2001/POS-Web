// config.js
const config = {
  pos_api_url:'http://localhost:5005',  // Vite env variable

  azure_ad_config: {
    apis: {
      POS: {
        name: "POS_API",
      },
    },
  },
};

export default config;

// Optional: test the env variable
console.log("POS API URL:", config.pos_api_url);
