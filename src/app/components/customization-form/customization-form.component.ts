import { Component } from '@angular/core';
import * as QRCode from 'qrcode';
import { FirestoreService } from '../../services/firestore.service';
import { BusinessCardPreviewComponent } from "../business-card-preview/business-card-preview.component";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-customization-form',
  templateUrl: './customization-form.component.html',
  styleUrls: ['./customization-form.component.css'],
  imports: [BusinessCardPreviewComponent, ReactiveFormsModule, FormsModule, NgIf]
})
export class CustomizationFormComponent {
  userName: string = '';
  userAddress: string = '';
  userPhone: string = '';
  selectedColor: string = '#0077ff';
  logoUrl: string = '';
  qrCodeUrl: string = '';
  usermail: string = '';

  constructor(private firestoreService: FirestoreService) {}

  async saveCardAndGenerateQRCode(): Promise<void> {
    const cardData = {
      userName: this.userName,
      userAddress: this.userAddress,
      userPhone: this.userPhone,
      color: this.selectedColor,
      logo: this.logoUrl,
      usermail: this.usermail
    };

    // Save business card in Firestore
    const cardId = 'business_card_' + Date.now(); // Generate a unique ID
    await this.firestoreService.saveBusinessCard(cardId, cardData);
    
    // Generate QR Code linking to the saved card
    const qrData = `https://myangularproject-one.vercel.app/view-card/${cardId}`;
    
    QRCode.toDataURL(qrData, (err, url) => {
      if (err) {
        console.error("Error generating QR code", err);
        return;
      }
      this.qrCodeUrl = url; // Store QR code URL for UI display
      this.downloadQRCode(url); // Trigger QR code download
    });
  }

  // Function to trigger QR Code download
  downloadQRCode(qrUrl: string) {
    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = 'business-card-qr.png'; // Download filename
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Function to handle logo image upload
  onLogoUpload(event: any): void {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.logoUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
}

