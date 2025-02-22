import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirestoreService } from '../../services/firestore.service';
import { NgIf } from '@angular/common';
import { QRCodeComponent } from 'angularx-qrcode'; // ✅ Import QRCodeComponent instead of QRCodeModule

@Component({
  selector: 'app-business-card-viewer',
  standalone: true,
  imports: [NgIf, QRCodeComponent], // ✅ Use QRCodeComponent instead of QRCodeModule
  templateUrl: './business-card-viewer.component.html',
  styleUrl: './business-card-viewer.component.css'
})
export class BusinessCardViewerComponent implements OnInit {
  cardData: any = null;
  qrData: string = ''; // ✅ QR Code Data

  constructor(
    private route: ActivatedRoute,
    private firestoreService: FirestoreService
  ) {}

  async ngOnInit(): Promise<void> {
    const cardId = this.route.snapshot.paramMap.get('id');
    if (cardId) {
      this.cardData = await this.firestoreService.getBusinessCard(cardId);
      if (this.cardData) {
        this.generateQRCode();
      }
    }
  }

  private generateQRCode(): void {
    this.qrData = JSON.stringify({
      name: this.cardData.userName,
      phone: this.cardData.userPhone,
      email: this.cardData.usermail,
      address: this.cardData.userAddress
    });
  }
}
