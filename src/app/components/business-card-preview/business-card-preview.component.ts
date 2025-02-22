import { Component, ElementRef, Input, AfterViewInit, OnChanges, ViewChild } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-business-card-preview',
  templateUrl: './business-card-preview.component.html',
  styleUrls: ['./business-card-preview.component.css']
})
export class BusinessCardPreviewComponent implements AfterViewInit, OnChanges {
  @ViewChild('threeCanvas') threeCanvas!: ElementRef;

  @Input() userName: string = 'Your Name';
  @Input() userAddress: string = 'Your Address';
  @Input() userPhone: string = 'Your Phone';
  @Input() selectedColor: string = '#0077ff';
  @Input() logoUrl: string = '';
  @Input() usermail: string = '';


  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private cardMesh!: THREE.Mesh;
  private textureLoader = new THREE.TextureLoader();
  private textCanvas!: HTMLCanvasElement;
  private textTexture!: THREE.Texture;
  private lastTime = 0;

  ngAfterViewInit(): void {
    this.initScene();
    this.createBusinessCard();
    this.animate();
  }

  ngOnChanges(): void {
    this.updateCard();
  }

  private initScene(): void {
    const width = 600;
    const height = 600;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    this.camera.position.set(0, 0, 4);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(width, height);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.threeCanvas.nativeElement.appendChild(this.renderer.domElement);

    // Add lighting for better quality
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    this.scene.add(directionalLight);
  }

  private createBusinessCard(): void {
    const cardGeometry = new THREE.BoxGeometry(3, 1.8, 0.05);
    const cardMaterial = new THREE.MeshStandardMaterial({ color: this.selectedColor });

    this.cardMesh = new THREE.Mesh(cardGeometry, cardMaterial);
    this.cardMesh.castShadow = true;
    this.cardMesh.receiveShadow = true;
    this.scene.add(this.cardMesh);

    this.updateTextTexture();

    if (this.logoUrl) {
      this.applyLogoTexture();
    }
  }

  private applyLogoTexture(): void {
    this.textureLoader.load(this.logoUrl, (texture) => {
      texture.flipY = false;
      texture.minFilter = THREE.LinearMipMapLinearFilter;
      texture.magFilter = THREE.LinearFilter;

      const logoMaterial = new THREE.MeshStandardMaterial({ map: texture, transparent: true });
      const logoMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 0.6), logoMaterial);
      logoMesh.position.set(1, -0.6, 0.03); // Bottom-right corner
      this.scene.add(logoMesh);
    });
  }

  private updateTextTexture(): void {
    this.textCanvas = document.createElement('canvas');
    this.textCanvas.width = 1024;
    this.textCanvas.height = 512;
    const ctx = this.textCanvas.getContext('2d')!;
    ctx.fillStyle = this.selectedColor;
    ctx.fillRect(0, 0, this.textCanvas.width, this.textCanvas.height);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 50px Arial';
    ctx.fillText(this.userName, 50, 100);
    ctx.font = 'bold 35px Arial';
    ctx.fillText(this.userAddress, 50, 200);
    ctx.fillText(this.userPhone, 50, 300);

    this.textTexture = new THREE.Texture(this.textCanvas);
    this.textTexture.minFilter = THREE.LinearFilter;
    this.textTexture.magFilter = THREE.LinearFilter;
    this.textTexture.needsUpdate = true;

    const textMaterial = new THREE.MeshStandardMaterial({ map: this.textTexture });
    const textMesh = new THREE.Mesh(new THREE.PlaneGeometry(3, 1.8), textMaterial);
    textMesh.position.set(0, 0, 0.03);
    this.scene.add(textMesh);
  }

  private updateCard(): void {
    if (this.cardMesh) {
      (this.cardMesh.material as THREE.MeshStandardMaterial).color.set(this.selectedColor);
    }
    this.updateTextTexture();
  }

  private animate(time = 0): void {
    requestAnimationFrame((t) => this.animate(t));
    const delta = (time - this.lastTime) / 1000;
    this.lastTime = time;

    // Smooth rotation animation
    if (this.cardMesh) {
      this.cardMesh.rotation.y += delta * 0.5;
    }

    this.renderer.render(this.scene, this.camera);
  }
}
