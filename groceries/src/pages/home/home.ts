import { Component } from '@angular/core';
import { NavController, ToastController, AlertController } from 'ionic-angular';
import { GroceriesServiceProvider } from '../../providers/groceries-service';
import { SocialSharing } from '@ionic-native/social-sharing';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  title = "Grocery Store";
  items = [];
  errorMessage: string;

  constructor(public navCtrl: NavController, public toastCtrl: ToastController, public alertCtrl: AlertController, public gdataSVC: GroceriesServiceProvider, public socialSharing: SocialSharing) {
    gdataSVC.dataChanged$.subscribe((dataChanged: boolean) => { this.loadItems();}
    );
  }

  ionViewDidLoad(){
    this.loadItems();
  }

  loadItems() {
    return this.gdataSVC.getItems().subscribe(
        items => this.items = items,
        error => this.errorMessage = <any>error
    );
  }


removeItem(item) {
  console.log("Removing Item - ", item);
  const toast = this.toastCtrl.create({
    message: 'Removing Item - ' + item + " ...",
    duration: 3000
  });
  toast.present();

  this.gdataSVC.removeItem(item);
}

addItem() {
  console.log("Adding Item");
  this.showAddItemPrompt();
}

showAddItemPrompt() {
  const prompt = this.alertCtrl.create({
    title: 'Add Item',
    message: "Please enter item...",
    inputs: [
      {
        name: 'name',
        placeholder: 'Name'
      },
      {
        name: 'quantity',
        placeholder: 'Quantity'
      },
      {
        name: 'price',
        placeholder: 'Price'
      }
    ],
    buttons: [
      {
        text: 'Cancel',
        handler: data => {
          console.log('Cancel clicked');
        }
      },
      {
        text: 'Save',
        handler: item => {
          console.log('Saved clicked', item);
          this.gdataSVC.addItem(item);
        }
      }
    ]
  });
  prompt.present();
}


editItem(item, index) {
  console.log("Edit Item - ", item, index);
  const toast = this.toastCtrl.create({
    message: 'Editing Item - ' + index + " ...",
    duration: 3000
  });
  toast.present();
  this.showEditItemPrompt(item, index);
} 

showEditItemPrompt(item, index) {
  const prompt = this.alertCtrl.create({
    title: 'Edit Item',
    message: "Please edit item...",
    inputs: [
      {
        name: 'name',
        placeholder: 'Name',
        value: item.name
      },
      {
        name: 'quantity',
        placeholder: 'Quantity',
        value: item.quantity
      },
      {
        name: 'price',
        placeholder: 'Price',
        value: item.price
      },
    ],
    buttons: [
      {
        text: 'Cancel',
        handler: data => {
          console.log('Cancel clicked');
        }
      },
      {
        text: 'Save',
        handler: item => {
          console.log('Update clicked', item);
          this.gdataSVC.editItem(item, index);
        }
      }
    ]
  });
  prompt.present();
}  

shareItem(item, index) {
    console.log("Sharing Item - ", item, index);
    const toast = this.toastCtrl.create({
      message: 'Sharing Item - ' + index + " ...",
      duration: 3000
    });

    toast.present();

    let message = "Grocery Item - Name: " + item.name + " - Quantity: " + item.quantity;
    let subject = "Shared via Groceries app";

    this.socialSharing.share(message, subject).then(() => {
      // Sharing via email is possible
      console.log("Shared successfully!");
    }).catch((error) => {
      console.error("Error while sharing ", error);
    });    

  }
  

}
