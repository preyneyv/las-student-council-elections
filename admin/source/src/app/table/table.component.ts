import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
  @Input() data;
  @Input() columns;
  @Input() actions = {};
  @Output() action = new EventEmitter();

  @Input() page = 0;
  @Input() pageSize = 10;
  @Input() paginate = true;
  get numPages() {
    const pages = Math.ceil(this.filtered.length / this.pageSize);
    return pages === 0 ? 1 : pages;
  }

  filtered = [];

  sortBy = {
    key: null,
    direction: 0
  };
  search = '';

  constructor() { }

  ngOnInit() {
  }

  keys(obj) { return Object.keys(obj); }

  sort(key) {
    if (this.sortBy.key === key) {
      this.sortBy.direction = this.sortBy.direction === 1 ? -1 : 1;
    } else {
      this.sortBy.direction = 1;
      this.sortBy.key = key;
    }
  }

  renderData() {
    const { key, direction } = this.sortBy;
    const sorted = this.data.sort((a, b) => {
      let x = -1;
      if (a[key] > b[key]) {
        x = 1;
      }
      return x * direction;
    });
    let filtered: any[] = sorted;
    if (this.search) {
      filtered = filtered
        .filter(row => Object.values(row)
          .some(
            v => v.toString()
                  .toLowerCase()
                  .includes(this.search)
          )
        );
    }
    this.filtered = filtered;
    if (this.page > this.numPages - 1) {
      this.page = this.numPages - 1;
    }
    let subset = filtered;
    if (this.paginate) {
      subset = filtered.slice(this.page * this.pageSize, (this.page + 1) * this.pageSize);
    }
    return subset;
  }

  trigger(row, action) {
    this.action.next({ row, action });
  }

  prevPage() {
    this.page--;
    if (this.page < 0) {
      this.page = 0;
    }
  }

  nextPage() {
    this.page++;
    if (this.page >= this.numPages - 1) {
      this.page = this.numPages - 1;
    }
  }
  number(n) {
    return Math.min(n, this.filtered.length);
  }
}
