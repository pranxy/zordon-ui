import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ZdDialog } from '@pranxy/zordon-ui/dialog';
import { DialogService } from '@pranxy/zordon-ui/dialogv2/dialog';
import { ComponentCard } from '../../../ui';

@Component({
    selector: 'dialog-animations-example-dialog',
    template: `<h3 class="text-lg font-bold">Hello!</h3>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogAnimationsExampleDialog {
    // readonly dialogRef = inject(ZdDialogRef<DialogAnimationsExampleDialog>);
}

@Component({
    selector: 'dev-modal-demo',
    imports: [ComponentCard],
    templateUrl: './modal-demo.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ModalDemoComponent {
    dialog = inject(ZdDialog);
    d = inject(DialogService);

    open() {
        this.d.open(DialogAnimationsExampleDialog);
        // this.dialog.open(DialogAnimationsExampleDialog);
    }

    basicModalCode = `<button class="btn" onclick="basic_modal.showModal()">Open Modal</button>
   <dialog id="basic_modal" class="modal">
     <div class="modal-box">
       <h3 class="font-bold text-lg">Hello!</h3>
       <p class="py-4">This is a basic modal that can be closed by clicking the X button or outside the modal.</p>
       <div class="modal-action">
         <form method="dialog">
           <button class="btn">Close</button>
         </form>
       </div>
     </div>
     <form method="dialog" class="modal-backdrop">
       <button>close</button>
     </form>
   </dialog>`;

    formModalCode = `<button class="btn" onclick="form_modal.showModal()">Open Form Modal</button>
   <dialog id="form_modal" class="modal">
     <div class="modal-box">
       <h3 class="font-bold text-lg">Enter your information</h3>
       <div class="py-4">
         <div class="form-control w-full">
           <label class="label">
             <span class="label-text">What is your name?</span>
           </label>
           <input type="text" placeholder="Type here" class="input input-bordered w-full" />
         </div>
         <div class="form-control w-full mt-4">
           <label class="label">
             <span class="label-text">Email</span>
           </label>
           <input type="email" placeholder="your@email.com" class="input input-bordered w-full" />
         </div>
       </div>
       <div class="modal-action">
         <form method="dialog" class="flex gap-2">
           <button class="btn">Cancel</button>
           <button class="btn btn-primary">Submit</button>
         </form>
       </div>
     </div>
     <form method="dialog" class="modal-backdrop">
       <button>close</button>
     </form>
   </dialog>`;

    confirmModalCode = `<button class="btn btn-error" onclick="confirm_modal.showModal()">Delete Item</button>
   <dialog id="confirm_modal" class="modal">
     <div class="modal-box">
       <h3 class="font-bold text-lg">Confirm Deletion</h3>
       <p class="py-4">Are you sure you want to delete this item? This action cannot be undone.</p>
       <div class="modal-action">
         <form method="dialog" class="flex gap-2">
           <button class="btn">Cancel</button>
           <button class="btn btn-error">Delete</button>
         </form>
       </div>
     </div>
     <form method="dialog" class="modal-backdrop">
       <button>close</button>
     </form>
   </dialog>`;

    imageModalCode = `<button class="btn" onclick="image_modal.showModal()">View Image</button>
   <dialog id="image_modal" class="modal">
     <div class="modal-box max-w-3xl">
       <h3 class="font-bold text-lg">Product Details</h3>
       <div class="py-4">
         <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
           <figure>
             <img src="https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg" alt="Product" class="rounded-xl" />
           </figure>
           <div>
             <h4 class="text-xl font-semibold">Premium Sneakers</h4>
             <p class="text-lg font-bold text-primary mt-2">$120.00</p>
             <p class="mt-4">High-quality sneakers made with premium materials for maximum comfort and durability.</p>
             <div class="flex gap-2 mt-4">
               <div class="badge badge-outline">Footwear</div>
               <div class="badge badge-outline">Sports</div>
               <div class="badge badge-outline">Casual</div>
             </div>
           </div>
         </div>
       </div>
       <div class="modal-action">
         <form method="dialog">
           <button class="btn">Close</button>
         </form>
       </div>
     </div>
     <form method="dialog" class="modal-backdrop">
       <button>close</button>
     </form>
   </dialog>`;
}
