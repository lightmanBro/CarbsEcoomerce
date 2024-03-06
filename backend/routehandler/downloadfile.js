const { uploadBucket } = require("../utilities/utils");

const { bucket } = uploadBucket("Item-media-files");

exports.downloadFile = async (req, res) => {
  //Check If the file is a video,

  //Remove a token amount specified on the global from the user viewing the file

  //Save the video file name into the viewed video
  const fileName = req.params.fileName;
  try {
    const downloadStream = bucket.openDownloadStreamByName(fileName);

    // Variable to accumulate file data
    let fileData = Buffer.alloc(0);
    downloadStream.on("data", (chunk) => {
      // Accumulate file data
      fileData = Buffer.concat([fileData, chunk]);
    });

    downloadStream.on("end", () => {
      // Set appropriate content type based on file type
      res.setHeader("Content-Type", downloadStream.s.file.contentType);

      // Send file data in the response body
      res.status(200).send(fileData);
    });

    downloadStream.on("error", (error) => {
      res.status(404).json({details:`Error downloading file ${fileName}:`, error });
    });
  } catch (error) {
    // console.error(
    //   `Error processing request for file ${req.params.fileName}:`,
    //   error
    // );
    res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
};
