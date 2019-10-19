import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, share } from 'rxjs/operators';
import { Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ProductModel } from '../../../models/product.model';
import { CartService } from '../../../services/cart/cart.service';

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
    public cartService: CartService,
    private breakpointObserver: BreakpointObserver,
    private device: DeviceDetectorService,
    private router: Router) {
  }

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated;
  }

  get isMobile(): boolean {
    return this.device.isMobile();
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

  getCartProductCount(): number {
    const cartProducts: ProductModel[] = this.getCartProducts();
    return cartProducts.length;
  }

  getCartProducts(): ProductModel[] {
    return this.cartService.getAllProductsAddedToCart();
  }

  getTotalPrice(): number {
    return this.cartService.getCartTotalPrice();
  }
}
