const multer = require("multer");
const fs = require("fs")

module.exports = {
    uploader: () => {

        // Lokasi utama penyimpanan file
        const defaultDir = "./public";

        // Konfigurasi multer
        const storageUploader = multer.diskStorage({
            destination:(req, file, cb) => {

                // Pemeriksaan direktori
                if(fs.existsSync(defaultDir)){

                    // Jika derictory ditemukan maka parameter callback dari destination akan menyimpan filenya
                    console.log(`Directory ${defaultDir} EXIST 👌`);
                    cb(null, defaultDir);

                }else {
                    fs.mkdir(defaultDir, (err) => {
                        if (err) {
                            console.log('Error Create Directory', err);
                        }
                        return cb(err, defaultDir);
                    });
                }
            },
            filename: (req, file, cb) => {
                // Menentukan nama file yang akan disimpan
                cb(null, `${Date.now()}-${file.originalname}`);
            }
        });

        const fileFilter = (req, file, cb) => {
            console.log("CHECK FILE FROM REQUEST CLIENTS", file);
            if (file.originalname.toLowerCase().includes("png") || 
            file.originalname.toLowerCase().includes("jpg")){
                cb(null, true);
            }
            else {
                cb(new Error ("Your file extention are denied. Only png or JPG", false))
            }
        };

        return multer({storage:storageUploader, fileFilter})
    },
};

