import express from 'express';
import bodyParser from 'body-parser';
import {checkImageURL, deleteLocalFiles, filterImageFromURL} from './util/util';


(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  /**
   * Function get a URL and
   */
  app.get("/filteredimage", async (request, response) => {
    let {image_url} = request.query
    // Check if user has passed the url. if true process if not return response with 422 error
    if (image_url) {
      //Check if the image url is of an image(ends with .jpg, .png etc)
      if (checkImageURL(image_url)) {
        console.log("Image URl is valid")
        try {
          const imagePath = await filterImageFromURL(image_url)
          response.status(200).sendFile(imagePath, function (){
            deleteLocalFiles([imagePath])
          })
        } catch (e) {
          console.log(e)
        }

      } else {
        return response.status(400).send("Sorry can't process image,the URL is not of an image.")
      }
    } else {
      return response.status(422).send("Sorry can't process image,URl is missing")
    }

  });

  //! END @TODO1

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}")
  });


  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();
