const { createClient } = require('@sanity/client');

// Create a client with the provided token
const client = createClient({
  projectId: 'r689038t',
  dataset: 'production',
  token: 'sktNp54VRzW4dt7e6pRZRwHsW1ODzBFZyCmTSVMOHBZPLHgEUooNWDeMNumY0VGNwmViJnTNSfaH0Pyx6nBloA4Ezv4y3gSTjK7GsIIV7PMhWijCB8TGkbxYUrBLhLZTxROQPo2Rv8go1l2rKFctQczXQPq3QQ14WqbBxdhxCNEWAt6gcoJ2',
  apiVersion: '2023-06-20',
  useCdn: false
});

async function updateNavbarSettings() {
  console.log('Updating navbar settings with mobile menu and navigation links...');

  try {
    // First, fetch existing navbar settings
    const existingSettings = await client.fetch('*[_type == "navbarSettings"]');
    
    if (existingSettings.length === 0) {
      console.log('No existing navbar settings found. Creating new one...');
      
      // Create new navbar settings with all fields
      const newNavbarSettings = {
        _type: 'navbarSettings',
        _id: 'navbar-settings',
        logo: null, // Will need to be set in Sanity Studio
        logoLink: '/',
        navigation: {
          levelsText: 'All Levels',
          subjectsText: 'All Subjects',
          allLevelsPageLink: '/levels',
          allSubjectsPageLink: '/subjects',
        },
        mobileMenu: {
          closeButtonColor: '#000000',
          dropdownArrowColor: '#001A96',
          borderColor: '#F7F7FC',
        },
        buttonText: 'Hire a tutor',
        buttonLink: '#contact-form',
      };

      const result = await client.createOrReplace(newNavbarSettings);
      console.log('✅ New navbar settings created successfully:', result._id);
      
    } else {
      // Update existing navbar settings
      for (const setting of existingSettings) {
        console.log(`Updating navbar setting: ${setting._id}`);
        
        const updatedSetting = {
          ...setting,
          navigation: {
            ...setting.navigation,
            allLevelsPageLink: setting.navigation?.allLevelsPageLink || '/levels',
            allSubjectsPageLink: setting.navigation?.allSubjectsPageLink || '/subjects',
          },
          mobileMenu: setting.mobileMenu || {
            closeButtonColor: '#000000',
            dropdownArrowColor: '#001A96',
            borderColor: '#F7F7FC',
          },
        };

        const result = await client.createOrReplace(updatedSetting);
        console.log(`✅ Updated navbar setting: ${result._id}`);
      }
    }

    console.log('✅ Navbar settings update completed successfully!');
    
  } catch (error) {
    console.error('❌ Error updating navbar settings:', error);
    throw error;
  }
}

// Run the script if called directly
if (require.main === module) {
  updateNavbarSettings()
    .then(() => {
      console.log('Navbar settings update completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Failed to update navbar settings:', error);
      process.exit(1);
    });
}

module.exports = { updateNavbarSettings }; 