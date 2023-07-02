import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-employee-upload',
  templateUrl: './AffaireUploadComponent.html',
  styleUrls: ['./AffaireUploadComponent.css']
})
export class AffaireUploadComponent {

  selectedFile: File;

  constructor(private http: HttpClient) { }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  uploadFile() {
    const formData: FormData = new FormData();
    formData.append('file', this.selectedFile, this.selectedFile.name);

    this.http.post('http://localhost:8081/api/employeesimport', formData)
      .subscribe(
        () => {
          console.log('File uploaded successfully');
        },
        (error) => {
          console.error('Error uploading file:', error);
        }
      );
  }
}
