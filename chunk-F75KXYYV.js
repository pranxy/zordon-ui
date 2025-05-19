import{b as c}from"./chunk-JBE3XO7N.js";import"./chunk-HO6UQR6R.js";import"./chunk-W2O67AHQ.js";import{Aa as r,Ma as p,Xa as o,aa as s,ba as a,eb as e,fb as t,gb as i,qb as n}from"./chunk-26CHXJ7I.js";import"./chunk-7CGTOI24.js";var w=(()=>{class l{constructor(){this.basicAlertsCode=`<div class="alert">
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-info shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
  <span>Default alert message.</span>
</div>
<div class="alert alert-info">
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
  <span>New information is available.</span>
</div>
<div class="alert alert-success">
  <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
  <span>Operation completed successfully!</span>
</div>
<div class="alert alert-warning">
  <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
  <span>Warning: This action cannot be undone!</span>
</div>
<div class="alert alert-error">
  <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
  <span>An error occurred during the operation!</span>
</div>`,this.alertActionsCode=`<div class="alert">
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-info shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
  <span>New software update available.</span>
  <div>
    <button class="btn btn-sm">Dismiss</button>
    <button class="btn btn-sm btn-primary">Update</button>
  </div>
</div>

<div class="alert alert-warning">
  <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
  <div>
    <h3 class="font-bold">Your session is about to expire!</h3>
    <div class="text-xs">You will be logged out in 5 minutes due to inactivity.</div>
  </div>
  <div>
    <button class="btn btn-sm">Dismiss</button>
    <button class="btn btn-sm btn-primary">Stay Logged In</button>
  </div>
</div>`,this.dismissibleAlertsCode=`<div role="alert" class="alert alert-info">
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
  <span>New software update available.</span>
  <button class="btn btn-circle btn-xs">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
  </button>
</div>`,this.customAlertCode=`<div class="alert shadow-lg">
  <div>
    <div class="avatar online">
      <div class="w-12 rounded-full">
        <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
      </div>
    </div>
    <div>
      <h3 class="font-bold">New message from Jane</h3>
      <div class="text-xs">You have a new message in your inbox</div>
    </div>
  </div>
  <div class="flex-none">
    <button class="btn btn-sm btn-ghost">Dismiss</button>
    <button class="btn btn-sm btn-primary">View</button>
  </div>
</div>`}static{this.\u0275fac=function(d){return new(d||l)}}static{this.\u0275cmp=p({type:l,selectors:[["dev-alert-demo"]],decls:107,vars:4,consts:[[1,"component-section"],[1,"text-3xl","font-bold","mb-6"],[1,"mb-8"],["title","Basic Alerts","description","Different types of alerts for different contexts.",3,"codeSnippet"],[1,"space-y-4"],[1,"alert"],["xmlns","http://www.w3.org/2000/svg","fill","none","viewBox","0 0 24 24",1,"stroke-info","shrink-0","w-6","h-6"],["stroke-linecap","round","stroke-linejoin","round","stroke-width","2","d","M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"],[1,"alert","alert-info"],["xmlns","http://www.w3.org/2000/svg","fill","none","viewBox","0 0 24 24",1,"stroke-current","shrink-0","w-6","h-6"],[1,"alert","alert-success"],["xmlns","http://www.w3.org/2000/svg","fill","none","viewBox","0 0 24 24",1,"stroke-current","shrink-0","h-6","w-6"],["stroke-linecap","round","stroke-linejoin","round","stroke-width","2","d","M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"],[1,"alert","alert-warning"],["stroke-linecap","round","stroke-linejoin","round","stroke-width","2","d","M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"],[1,"alert","alert-error"],["stroke-linecap","round","stroke-linejoin","round","stroke-width","2","d","M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"],["title","Alerts with Actions","description","Alerts with buttons for user actions.",3,"codeSnippet"],[1,"btn","btn-sm"],[1,"btn","btn-sm","btn-primary"],[1,"btn","btn-sm","btn-ghost"],[1,"font-bold"],[1,"text-xs"],["title","Dismissible Alerts","description","Alerts that can be closed by the user.",3,"codeSnippet"],["role","alert",1,"alert","alert-info"],[1,"btn","btn-circle","btn-xs"],["xmlns","http://www.w3.org/2000/svg","fill","none","viewBox","0 0 24 24","stroke","currentColor",1,"h-4","w-4"],["stroke-linecap","round","stroke-linejoin","round","stroke-width","2","d","M6 18L18 6M6 6l12 12"],["role","alert",1,"alert","alert-success"],["role","alert",1,"alert","alert-error"],["title","Custom Alert","description","Customized alert with more complex content.",3,"codeSnippet"],[1,"alert","shadow-lg"],[1,"avatar","online"],[1,"w-12","rounded-full"],["src","https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"],[1,"flex-none"]],template:function(d,m){d&1&&(e(0,"div",0)(1,"h1",1),n(2,"Alerts"),t(),e(3,"p",2),n(4," Alerts are used to show important messages to users. DaisyUI provides beautiful alert components with different styles and variants. "),t(),e(5,"dev-component-card",3)(6,"div",4)(7,"div",5),s(),e(8,"svg",6),i(9,"path",7),t(),a(),e(10,"span"),n(11,"Default alert message."),t()(),e(12,"div",8),s(),e(13,"svg",9),i(14,"path",7),t(),a(),e(15,"span"),n(16,"New information is available."),t()(),e(17,"div",10),s(),e(18,"svg",11),i(19,"path",12),t(),a(),e(20,"span"),n(21,"Operation completed successfully!"),t()(),e(22,"div",13),s(),e(23,"svg",11),i(24,"path",14),t(),a(),e(25,"span"),n(26,"Warning: This action cannot be undone!"),t()(),e(27,"div",15),s(),e(28,"svg",11),i(29,"path",16),t(),a(),e(30,"span"),n(31,"An error occurred during the operation!"),t()()()(),e(32,"dev-component-card",17)(33,"div",4)(34,"div",5),s(),e(35,"svg",6),i(36,"path",7),t(),a(),e(37,"span"),n(38,"New software update available."),t(),e(39,"div")(40,"button",18),n(41,"Dismiss"),t(),e(42,"button",19),n(43,"Update"),t()()(),e(44,"div",10),s(),e(45,"svg",11),i(46,"path",12),t(),a(),e(47,"span"),n(48,"Your purchase has been confirmed!"),t(),e(49,"div")(50,"button",20),n(51,"View Receipt"),t()()(),e(52,"div",13),s(),e(53,"svg",11),i(54,"path",14),t(),a(),e(55,"div")(56,"h3",21),n(57,"Your session is about to expire!"),t(),e(58,"div",22),n(59," You will be logged out in 5 minutes due to inactivity. "),t()(),e(60,"div")(61,"button",18),n(62,"Dismiss"),t(),e(63,"button",19),n(64,"Stay Logged In"),t()()()()(),e(65,"dev-component-card",23)(66,"div",4)(67,"div",24),s(),e(68,"svg",9),i(69,"path",7),t(),a(),e(70,"span"),n(71,"New software update available."),t(),e(72,"button",25),s(),e(73,"svg",26),i(74,"path",27),t()()(),a(),e(75,"div",28),s(),e(76,"svg",11),i(77,"path",12),t(),a(),e(78,"span"),n(79,"Your purchase has been confirmed!"),t(),e(80,"button",25),s(),e(81,"svg",26),i(82,"path",27),t()()(),a(),e(83,"div",29),s(),e(84,"svg",11),i(85,"path",16),t(),a(),e(86,"span"),n(87,"There was an error processing your payment!"),t(),e(88,"button",25),s(),e(89,"svg",26),i(90,"path",27),t()()()()(),a(),e(91,"dev-component-card",30)(92,"div",31)(93,"div")(94,"div",32)(95,"div",33),i(96,"img",34),t()(),e(97,"div")(98,"h3",21),n(99,"New message from Jane"),t(),e(100,"div",22),n(101,"You have a new message in your inbox"),t()()(),e(102,"div",35)(103,"button",20),n(104,"Dismiss"),t(),e(105,"button",19),n(106,"View"),t()()()()()),d&2&&(r(5),o("codeSnippet",m.basicAlertsCode),r(27),o("codeSnippet",m.alertActionsCode),r(33),o("codeSnippet",m.dismissibleAlertsCode),r(26),o("codeSnippet",m.customAlertCode))},dependencies:[c],encapsulation:2,changeDetection:0})}}return l})();export{w as default};
