import { Component, OnInit } from '@angular/core';
import { faFacebook, faInstagram, faTwitter, faYoutube } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  facebook = faFacebook;
  instagram = faInstagram;
  twitter = faTwitter;
  youtube = faYoutube;

  constructor() {
  }

  ngOnInit() {
  }

}
