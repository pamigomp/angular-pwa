import { Component, OnInit } from '@angular/core';
import { CategoryService } from './services/category/category.service';
import { CategoryModel } from './models/category.model';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, share } from 'rxjs/operators';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  categories: CategoryModel[];

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      share()
    );

  constructor(
    private categoryService: CategoryService,
    private breakpointObserver: BreakpointObserver,
    private device: DeviceDetectorService
  ) {
  }

  ngOnInit() {
    this.categoryService.getAllCategories().subscribe((categories: CategoryModel[]) => {
      this.categories = categories;
    });
  }

  get isMobile(): boolean {
    return this.device.isMobile();
  }
}
