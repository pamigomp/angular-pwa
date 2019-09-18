import { Component, OnInit } from '@angular/core';
import { faFacebook, faInstagram, faTwitter, faYoutube, IconDefinition } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  facebook: IconDefinition = faFacebook;
  instagram: IconDefinition = faInstagram;
  twitter: IconDefinition = faTwitter;
  youtube: IconDefinition = faYoutube;
  currentYear: number = new Date().getFullYear();

  constructor() {
  }

  ngOnInit() {
  }

}
