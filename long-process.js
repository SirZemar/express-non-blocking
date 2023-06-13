const longProcess = (req, res) => {
  return new Promise((resolve, reject) => {
    try {
      let i = 0;
      let j = 0;

      const process = () => {
        if (req.timedout) {
          // abort promise if req emits timeout
          res.status(408).json({ success: false, msg: "Process timed out" });
          return reject("Function timeout!");
        }
        while (i < 200) {
          while (j < 5000) {
            console.log(i, j);
            j++;
            // Pause execution after each iteration to allow other tasks to run
            if (j % 100 === 0) {
              setImmediate(process);
              return;
            }
          }
          j = 0; // Reset j for the next iteration
          i++;
        }
        return resolve(); // Resolve the promise when the loop completes
      };

      // Start the non-blocking process
      setImmediate(process);
    } catch (error) {
      return reject("Could not process request: ", error);
    }
  });
};
module.exports = longProcess;
