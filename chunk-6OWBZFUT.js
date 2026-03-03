import{g as y}from"./chunk-5IEEMIM6.js";import{$a as i,Ia as v,U as r,Ua as u,Va as b,Ya as g,Za as f,_a as c,ab as e,bb as d,qa as m,sb as a,ta as s,tb as p}from"./chunk-7C4AYDYD.js";import"./chunk-4CLCTAJ7.js";var x=(t,o)=>o.title;function w(t,o){t&1&&(i(0,"div",7),r(),i(1,"svg",13),d(2,"path",14),e(),a(3," Ready "),e())}function k(t,o){t&1&&(i(0,"div",8),r(),i(1,"svg",13),d(2,"path",15),e(),a(3," In Progress "),e())}function C(t,o){if(t&1&&(i(0,"div",3)(1,"div",4)(2,"div",5)(3,"h2",6),a(4),e(),u(5,w,4,0,"div",7)(6,k,4,0,"div",8),e(),i(7,"div",9),d(8,"div",10),e(),i(9,"p"),a(10),e(),i(11,"div",11)(12,"a",12),a(13,"View All"),e()()()()),t&2){let n=o.$implicit;s(4),p(n.title),s(),b(n.ready?5:6),s(3),c("innerHTML",n.preview(),m),s(2),p(n.description),s(2),c("routerLink",n.link)}}var T=(()=>{class t{constructor(){this.components=[{title:"Buttons",description:"Customizable buttons with various styles, sizes, and states.",link:"/components/button",ready:!0,preview:()=>`
        <div class="flex flex-wrap gap-2">
          <button class="btn btn-primary">Primary</button>
          <button class="btn btn-secondary">Secondary</button>
          <button class="btn btn-accent">Accent</button>
        </div>
      `},{title:"Cards",description:"Versatile cards for displaying content and actions.",link:"/components/card",ready:!0,preview:()=>`
        <div class="card bg-base-100 shadow-sm">
          <div class="card-body p-4">
            <h3 class="card-title text-sm">Sample Card</h3>
            <p class="text-xs">Flexible container for any content.</p>
          </div>
        </div>
      `},{title:"Forms",description:"Form controls with validation and accessibility.",link:"/components/form",ready:!0,preview:()=>`
        <div class="space-y-2">
          <input type="text" placeholder="Input" class="input input-bordered w-full" />
          <select class="select select-bordered w-full">
            <option>Select option</option>
          </select>
        </div>
      `},{title:"Typography",description:"Text styles for clear visual hierarchy.",link:"/components/typography",ready:!0,preview:()=>`
        <div class="space-y-1">
          <h3 class="text-lg font-bold">Heading</h3>
          <p class="text-sm">Beautiful typography styles.</p>
          <p class="text-xs opacity-70">With responsive scaling.</p>
        </div>
      `},{title:"Modals",description:"Accessible modal dialogs and popovers.",link:"/components/modal",ready:!0,preview:()=>`
        <button class="btn btn-sm" onclick="demo_modal.showModal()">Open Modal</button>
        <dialog id="demo_modal" class="modal">
          <div class="modal-box">
            <h3 class="font-bold text-lg">Sample Modal</h3>
            <p class="py-4">Click outside to close</p>
          </div>
          <form method="dialog" class="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>
      `},{title:"Alerts",description:"Contextual feedback messages.",link:"/components/alert",ready:!0,preview:()=>`
        <div class="alert alert-success text-xs">
          <span>Sample success alert</span>
        </div>
      `},{title:"Tables",description:"Data tables with sorting and filtering.",link:"/components/table",ready:!0,preview:()=>`
        <div class="overflow-x-auto">
          <table class="table table-xs">
            <thead>
              <tr>
                <th>Name</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Sample</td>
                <td>Data</td>
              </tr>
            </tbody>
          </table>
        </div>
      `},{title:"Navigation",description:"Navigation components and menus.",link:"/components/navigation",ready:!0,preview:()=>`
        <div class="tabs tabs-sm">
          <a class="tab tab-active">Tab 1</a>
          <a class="tab">Tab 2</a>
        </div>
      `},{title:"Badges",description:"Status indicators and counters.",link:"/components/badge",ready:!0,preview:()=>`
        <div class="flex flex-wrap gap-2">
          <div class="badge">Default</div>
          <div class="badge badge-primary">Primary</div>
          <div class="badge badge-secondary">Secondary</div>
        </div>
      `},{title:"Avatars",description:"User avatars and placeholders.",link:"/components/avatar",ready:!0,preview:()=>`
        <div class="flex gap-2">
          <div class="avatar">
            <div class="w-12 rounded-full">
              <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
            </div>
          </div>
          <div class="avatar placeholder">
            <div class="bg-neutral-focus text-neutral-content rounded-full w-12">
              <span>MX</span>
            </div>
          </div>
        </div>
      `},{title:"Skeletons",description:"Loading state placeholders.",link:"/components/skeleton",ready:!1,preview:()=>`
        <div class="flex flex-col gap-4">
          <div class="skeleton h-4 w-20"></div>
          <div class="skeleton h-4 w-full"></div>
          <div class="skeleton h-4 w-28"></div>
        </div>
      `},{title:"Toasts",description:"Notification messages.",link:"/components/toast",ready:!1,preview:()=>`
        <div class="alert alert-success">
          <span>Message sent successfully!</span>
        </div>
      `},{title:"Tooltips",description:"Informative hover tooltips.",link:"/components/tooltip",ready:!1,preview:()=>`
        <div class="tooltip" data-tip="Hello!">
          <button class="btn">Hover me</button>
        </div>
      `}]}static{this.\u0275fac=function(l){return new(l||t)}}static{this.\u0275cmp=v({type:t,selectors:[["dev-components"]],decls:8,vars:0,consts:[[1,"prose","max-w-none"],[1,"lead"],[1,"grid","grid-cols-1","md:grid-cols-2","lg:grid-cols-3","gap-6","mt-8"],[1,"card","bg-base-200"],[1,"card-body"],[1,"flex","justify-between","items-start"],[1,"card-title"],[1,"badge","badge-success","gap-1"],[1,"badge","badge-warning","gap-1"],[1,"py-4"],[3,"innerHTML"],[1,"card-actions","justify-end"],[1,"btn","btn-sm",3,"routerLink"],["xmlns","http://www.w3.org/2000/svg","fill","none","viewBox","0 0 24 24",1,"inline-block","w-4","h-4","stroke-current"],["stroke-linecap","round","stroke-linejoin","round","stroke-width","2","d","M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"],["stroke-linecap","round","stroke-linejoin","round","stroke-width","2","d","M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"]],template:function(l,h){l&1&&(i(0,"div",0)(1,"h1"),a(2,"Components"),e(),i(3,"p",1),a(4," Explore our collection of beautiful, accessible, and customizable components. Built with Angular CDK, DaisyUI, and TailwindCSS for maximum flexibility and performance. "),e(),i(5,"div",2),g(6,C,14,5,"div",3,x),e()()),l&2&&(s(6),f(h.components))},dependencies:[y],encapsulation:2,changeDetection:0})}}return t})();export{T as default};
