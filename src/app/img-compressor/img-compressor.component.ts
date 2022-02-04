import { Component, OnInit } from '@angular/core';
import {
  DataUrl,
  DOC_ORIENTATION,
  NgxImageCompressService,
  UploadResponse,
} from 'ngx-image-compress';

interface FileMetaData {
  base64: string;
  fileName: string;
  fileExtension: string;
  fileSize: number;
  fileWidth: number;
  fileHeight: number;
}

@Component({
  selector: 'app-img-compressor',
  templateUrl: './img-compressor.component.html',
  styleUrls: ['./img-compressor.component.scss'],
})
export class ImgCompressorComponent {
  fileMetaData: FileMetaData = {
    base64: '',
    fileName: '',
    fileExtension: '',
    fileSize: 0,
    fileWidth: 0,
    fileHeight: 0,
  };
  imgResultBeforeCompress: DataUrl = '';
  imgResultAfterCompress: DataUrl = '';
  imgResultAfterResize: DataUrl = '';
  imgResultUpload: DataUrl = '';
  imgResultAfterResizeMax: DataUrl = '';
  imgResultMultiple: UploadResponse[] = [];

  constructor(private imageCompress: NgxImageCompressService) {}

  async getImageMetaData(file: File): Promise<any> {
    this.fileMetaData = {
      fileName: file.name,
      fileExtension: file.type,
      fileSize: file.size,
      fileWidth: 0,
      fileHeight: 0,
      base64: '',
    };
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.src = e?.target?.result?.toString() || '';
        this.fileMetaData.base64 = e?.target?.result?.toString() || '';

        img.addEventListener('load', () => {
          this.fileMetaData.fileWidth = img.width;
          this.fileMetaData.fileHeight = img.height;

          resolve(this.fileMetaData);
        });

        img.addEventListener('error', () => reject);
      };
      reader.readAsDataURL(file);
    });
  }

  async uploadfile(e: any) {
    const file = e.target.files[0];

    const metaData = await this.getImageMetaData(file);

    const image = metaData.base64;

    console.warn('Size in bytes was:', this.imageCompress.byteCount(image));
    console.warn('Compressing and resizing to width 200px height 100px...');

    const compResizedImg = await this.imageCompress.compressFile(
      image,
      DOC_ORIENTATION.Up,
      50,
      50,
      200,
      100
    );
    this.imgResultAfterResize = compResizedImg;
    console.warn(
      'Size in bytes is now:',
      this.imageCompress.byteCount(compResizedImg)
    );
  }

  compressFile() {
    return this.imageCompress
      .uploadFile()
      .then(({ image, orientation }: UploadResponse) => {
        this.imgResultBeforeCompress = image;
        console.warn('Size in bytes was:', this.imageCompress.byteCount(image));

        this.imageCompress
          .compressFile(image, orientation, 50, 50)
          .then((result: DataUrl) => {
            this.imgResultAfterCompress = result;
            console.warn(
              'Size in bytes is now:',
              this.imageCompress.byteCount(result)
            );
          });
      });
  }

  uploadFile() {
    return this.imageCompress
      .uploadFile()
      .then(({ image, orientation }: UploadResponse) => {
        this.imgResultUpload = image;
        console.warn('DOC_ORIENTATION:', DOC_ORIENTATION[orientation]);
        console.warn(
          `${image.substring(0, 50)}... (${image.length} characters)`
        );
      });
  }

  uploadMultipleFiles() {
    return this.imageCompress
      .uploadMultipleFiles()
      .then((multipleOrientedFiles: UploadResponse[]) => {
        this.imgResultMultiple = multipleOrientedFiles;
        console.warn(`${multipleOrientedFiles.length} files selected`);
      });
  }

  uploadAndResize() {
    return this.imageCompress
      .uploadFile()
      .then(({ image, orientation }: UploadResponse) => {
        console.warn('Size in bytes was:', this.imageCompress.byteCount(image));
        console.warn('Compressing and resizing to width 200px height 100px...');

        this.imageCompress
          .compressFile(image, orientation, 50, 50, 200, 100)
          .then((result: DataUrl) => {
            this.imgResultAfterResize = result;
            console.warn(
              'Size in bytes is now:',
              this.imageCompress.byteCount(result)
            );
          });
      });
  }

  uploadAndReturnWithMaxSize() {
    return this.imageCompress.uploadAndGetImageWithMaxSize(1, true).then(
      (result: DataUrl) => {
        this.imgResultAfterResizeMax = result;
      },
      (result: string) => {
        console.error(
          "The compression algorithm didn't succed! The best size we can do is",
          this.imageCompress.byteCount(result),
          'bytes'
        );
        this.imgResultAfterResizeMax = result;
      }
    );
  }
}
