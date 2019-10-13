import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, share } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Output() drawerToggle = new EventEmitter<boolean>();
  searchQuery: string;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      share()
    );

  constructor(
    public authService: AuthService,
    private breakpointObserver: BreakpointObserver,
    private router: Router) {
  }

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated;
  }

  drawerOpen() {
    this.drawerToggle.emit(true);
  }

  ngOnInit() {
  }

  logout() {
    this.authService.logout();
  }

  getSearchResult(): void {
    this.router.navigate(['/search'], {queryParams: {query: this.searchQuery}});
  }
}
