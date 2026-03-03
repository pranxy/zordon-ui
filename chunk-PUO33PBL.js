import{a as B}from"./chunk-CCBECHP3.js";import{b as D}from"./chunk-MCTOSRGI.js";import{b as C}from"./chunk-5IEEMIM6.js";import{$a as e,Fb as l,Ia as p,Ma as b,Xa as v,Ya as u,Za as f,_a as r,ab as i,bb as c,ea as g,ga as m,kb as h,lb as y,sb as t,ta as s,tb as S,xb as x,yb as E}from"./chunk-7C4AYDYD.js";import"./chunk-4CLCTAJ7.js";var w={primary:"badge-primary",secondary:"badge-secondary",accent:"badge-accent",info:"badge-info",success:"badge-success",warning:"badge-warning",error:"badge-error",neutral:"badge-neutral"},z={xs:"badge-xs",sm:"badge-sm",md:"badge-md",lg:"badge-lg"},I={outline:"badge-outline",dash:"badge-dash",soft:"badge-soft",ghost:"badge-ghost"};var T=["*"],N=(()=>{class d extends B{constructor(){super(...arguments),this.color=l("primary"),this.size=l("md"),this.type=l(),this.animatePulse=l(!1),this.colorEft=g(()=>{let a=this.color();this.updateItemClass("color",w[a])}),this.sizeEft=g(()=>{let a=this.size();this.updateItemClass("size",z[a])}),this.typeEft=g(()=>{let a=this.type();a?this.updateItemClass("type",I[a]):this.removeItemClass("type")})}static{this.\u0275fac=(()=>{let a;return function(n){return(a||(a=m(d)))(n||d)}})()}static{this.\u0275cmp=p({type:d,selectors:[["zd-badge"]],hostAttrs:[1,"badge"],inputs:{color:[1,"color"],size:[1,"size"],type:[1,"type"],animatePulse:[1,"animatePulse"]},features:[b],ngContentSelectors:T,decls:1,vars:0,template:function(o,n){o&1&&(h(),y(0))},encapsulation:2,changeDetection:0})}}return d})();function A(d,M){if(d&1&&(e(0,"zd-badge",5),t(1),x(2,"titlecase"),i()),d&2){let a=M.$implicit;r("color",a),s(),S(E(2,2,a))}}var W=(()=>{class d{constructor(){this.colors=["warning","success","secondary","primary","neutral","info","error","accent"],this.sizes=["xs","sm","md","lg"],this.types=["dash","ghost","outline","soft"],this.basicBadgesCode=`<div class="badge">neutral</div>
<div class="badge badge-primary">primary</div>
<div class="badge badge-secondary">secondary</div>
<div class="badge badge-accent">accent</div>
<div class="badge badge-ghost">ghost</div>`,this.badgeSizesCode=`<div class="badge badge-sm">small</div>
<div class="badge">normal</div>
<div class="badge badge-lg">large</div>`,this.badgeVariantsCode=`<div class="badge badge-outline">outline</div>
<div class="badge badge-primary badge-outline">primary</div>
<div class="badge badge-secondary badge-outline">secondary</div>
<div class="badge badge-accent badge-outline">accent</div>`,this.statusBadgesCode=`<div class="badge badge-info gap-2">
  <div class="w-2 h-2 rounded-full bg-current"></div>
  info
</div>
<div class="badge badge-success gap-2">
  <div class="w-2 h-2 rounded-full bg-current"></div>
  success
</div>`,this.badgeComponentsCode=`<button class="btn">
  Inbox
  <div class="badge badge-secondary">+99</div>
</button>

<button class="btn">
  Notifications
  <div class="badge badge-primary badge-sm">3</div>
</button>

<div class="card w-96 bg-base-100 shadow-xl">
  <div class="card-body">
    <h2 class="card-title">
      New feature!
      <div class="badge badge-secondary">NEW</div>
    </h2>
    <p>This card has a badge in its title</p>
  </div>
</div>`}static{this.\u0275fac=function(o){return new(o||d)}}static{this.\u0275cmp=p({type:d,selectors:[["dev-badge-demo"]],decls:60,vars:5,consts:[[1,"component-section"],[1,"text-3xl","font-bold","mb-6"],[1,"mb-8"],["title","Basic Badges","description","Different styles of badges for various contexts.",3,"codeSnippet"],[1,"flex","flex-wrap","gap-2"],[3,"color"],["title","Badge Sizes","description","Badges in different sizes.",3,"codeSnippet"],[1,"flex","flex-wrap","gap-2","items-center"],[1,"badge","badge-sm"],[1,"badge"],[1,"badge","badge-lg"],["title","Badge Variants","description","Different variants of badges including outline style.",3,"codeSnippet"],[1,"badge","badge-outline"],[1,"badge","badge-primary","badge-outline"],[1,"badge","badge-secondary","badge-outline"],[1,"badge","badge-accent","badge-outline"],["title","Status Badges","description","Badges for showing different states.",3,"codeSnippet"],[1,"badge","badge-info","gap-2"],[1,"w-2","h-2","rounded-full","bg-current"],[1,"badge","badge-success","gap-2"],[1,"badge","badge-warning","gap-2"],[1,"badge","badge-error","gap-2"],["title","Badge in Components","description","Using badges within other components.",3,"codeSnippet"],[1,"flex","flex-col","gap-4"],[1,"btn"],[1,"badge","badge-secondary"],[1,"flex","gap-2"],[1,"badge","badge-primary","badge-sm"],[1,"card","w-96","bg-base-100","shadow-xl"],[1,"card-body"],[1,"card-title"]],template:function(o,n){o&1&&(e(0,"div",0)(1,"h1",1),t(2,"Badges"),i(),e(3,"p",2),t(4," Badges are small status descriptors for UI elements. Use them to highlight status, show counts, or display small pieces of information. "),i(),e(5,"app-component-card",3)(6,"div",4),u(7,A,3,4,"zd-badge",5,v),i()(),e(9,"app-component-card",6)(10,"div",7)(11,"div",8),t(12,"small"),i(),e(13,"div",9),t(14,"normal"),i(),e(15,"div",10),t(16,"large"),i()()(),e(17,"app-component-card",11)(18,"div",4)(19,"div",12),t(20,"outline"),i(),e(21,"div",13),t(22,"primary"),i(),e(23,"div",14),t(24,"secondary"),i(),e(25,"div",15),t(26,"accent"),i()()(),e(27,"app-component-card",16)(28,"div",4)(29,"div",17),c(30,"div",18),t(31," info "),i(),e(32,"div",19),c(33,"div",18),t(34," success "),i(),e(35,"div",20),c(36,"div",18),t(37," warning "),i(),e(38,"div",21),c(39,"div",18),t(40," error "),i()()(),e(41,"app-component-card",22)(42,"div",23)(43,"button",24),t(44," Inbox "),e(45,"div",25),t(46,"+99"),i()(),e(47,"div",26)(48,"button",24),t(49," Notifications "),e(50,"div",27),t(51,"3"),i()()(),e(52,"div",28)(53,"div",29)(54,"h2",30),t(55," New feature! "),e(56,"div",25),t(57,"NEW"),i()(),e(58,"p"),t(59,"This card has a badge in its title"),i()()()()()()),o&2&&(s(5),r("codeSnippet",n.basicBadgesCode),s(2),f(n.colors),s(2),r("codeSnippet",n.badgeSizesCode),s(8),r("codeSnippet",n.badgeVariantsCode),s(10),r("codeSnippet",n.statusBadgesCode),s(14),r("codeSnippet",n.badgeComponentsCode))},dependencies:[N,D,C],encapsulation:2,changeDetection:0})}}return d})();export{W as default};
