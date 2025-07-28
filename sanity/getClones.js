import { getCliClient } from 'sanity/cli'

const client = getCliClient()

async function getClones() {
  try {
    const clones = await client.fetch('*[_type == "clone"]{_id, cloneName, isActive} | order(cloneName asc)')
    console.log('Clone documents and their IDs:')
    console.log('=====================================')
    clones.forEach(clone => {
      const status = clone.isActive ? '✅ ACTIVE' : '❌ INACTIVE'
      console.log(`📁 ${clone.cloneName}`)
      console.log(`   ID: ${clone._id}`)
      console.log(`   Status: ${status}`)
      console.log('')
    })
    
    console.log('To add a new clone folder to the desk structure:')
    console.log('1. Copy the clone ID from above')
    console.log('2. Add it to sanity/deskStructure.ts in the items array')
    console.log('3. Use the format shown in the documentation')
  } catch (error) {
    console.error('Error fetching clones:', error)
  }
}

getClones() 