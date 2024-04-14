// Function to generate a random UID
const generateRandomUID = (prefix) => {
  // Generate a random number and multiply it by 100000000
  const counter = Math.floor(Math.random() * 100000000)
  // Convert the counter to a string and pad it with zeros to ensure it has 8 digits
  const formattedCounter = counter.toString().padStart(8, '0')
  // Combine the formattedCounter with the prefix 'P' to create the UID
  return `${prefix}${formattedCounter}`
}

module.exports = generateRandomUID
