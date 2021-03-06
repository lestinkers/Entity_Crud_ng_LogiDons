import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { OrderItem } from 'src/app/shared/order-item.model';
import { ItemService } from 'src/app/shared/item.service';
import { Item } from 'src/app/shared/item.model';
import { NgForm } from '@angular/forms';
import { OrderService } from 'src/app/shared/order.service';

@Component({
  selector: 'app-order-items',
  templateUrl: './order-items.component.html',
  styles: []
})
export class OrderItemsComponent implements OnInit {
  formData: OrderItem;
  itemList: Item[];
  isValid: boolean = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<OrderItemsComponent>,
    private itemService: ItemService,
    private orderService: OrderService) { }

  ngOnInit() {
    this.itemService.getItemList().then(res => this.itemList = res as Item[]);

    this.formData = {
      OrderItemID: null,
      OrderID: this.data.OrderID,
      ItemID: 0,
      ItemName: '',
      Price: 0,
      Quantity: 1,
      Total: 0
    }
  }

  updatePrice(ctrl){
    if(ctrl.selectedIndex==0){
      this.formData.Price = 0;
      this.formData.ItemName = '';
    }
    else {
      // array of dropdown is offset by one because value 0 is -select-, not an item
      this.formData.Price = this.itemList[ctrl.selectedIndex -1].Price;
      this.formData.ItemName = this.itemList[ctrl.selectedIndex -1].Name;
    }
    this.updateTotal();
  }

  updateTotal(){
    this.formData.Total = parseFloat((this.formData.Quantity * this.formData.Price).toFixed(2));
  }

  onSubmit(form: NgForm){
    if(this.validateForm(form.value)){
      // OrderService contains the orderItems: OrderItem[], we have to push the new element on it
      this.orderService.orderItems.push(form.value);
      this.dialogRef.close();
    }
  }

  // erreur de validation: video time 1:42:00
  validateForm(formData: OrderItem){
    this.isValid = true;
    if(formData.ItemID==0){
      this.isValid = false;
    } else if(formData.Quantity==0){
      this.isValid = false;
    }
    return this.isValid;
  }

}
