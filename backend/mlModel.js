const { spawn } = require('child_process');

// Function to call the Python gender classifier
async function validateGenderPhoto(imagePath, gender) {
  return new Promise((resolve, reject) => {
    console.log(`Calling Python script with image: ${imagePath}, gender: ${gender}`);
    
    const process = spawn('python3', ['mlModel.py', imagePath, gender]);

    process.stdout.on('data', (data) => {
      const output = data.toString().trim();
      console.log(`Python stdout: ${output}`);
      // Check if the output is 'True' or 'False'
      if (output === 'True') {
        resolve(true);
      } else if (output === 'False') {
        resolve(false);
      } else {
        reject('Unexpected output from Python script');
      }
    });

    process.stderr.on('data', (data) => {
      console.error(`Python stderr: ${data}`);
      reject(`Error from Python script: ${data}`);
    });

    process.on('close', (code) => {
      if (code !== 0) {
        reject(`Python process exited with code ${code}`);
      }
    });
  });
}

module.exports = { validateGenderPhoto };
