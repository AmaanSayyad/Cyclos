(window.webpackJsonp=window.webpackJsonp||[]).push([[9],{aA1n:function(e,i,t){"use strict";t.r(i),t.d(i,"WizardsModule",(function(){return $t}));var n=t("Se2V"),a=t("fXoL"),s=t("XDzf"),o=t("zlpg"),r=t("owZo"),l=t("qCwG"),c=t("ObUu"),d=t("c/3O"),u=t("3Pt+"),b=t("mwYl"),g=t("tzq7"),f=t("uuU0"),m=t("QH++"),h=t("p46w"),p=t.n(h),y=t("2Vo4"),v=t("SxV6");function I(e,i){1&e&&a.Mb(0)}function x(e,i){1&e&&a.Mb(0)}function w(e,i){if(1&e&&(a.Qb(0,"alert",18),a.Lb(1,"div",19),a.ac(2,"trust"),a.Pb()),2&e){const e=a.Zb(3);a.xb(1),a.gc("innerHTML",a.bc(2,1,e.informationText),a.tc)}}function C(e,i){if(1&e&&a.Lb(0,"run-wizard-step-group",20),2&e){const e=a.Zb(3);a.gc("groups",e.data.step.groups)("control",e.group)}}function P(e,i){if(1&e){const e=a.Rb();a.Qb(0,"run-wizard-step-idp",21),a.Xb("continue",(function(i){return a.sc(e),a.Zb(3).continueWithProvider(i)})),a.Pb()}if(2&e){const e=a.Zb(3);a.gc("identityProviders",e.data.step.identityProviders)}}function A(e,i){if(1&e&&a.Lb(0,"run-wizard-step-fields",22),2&e){const e=a.Zb(3);a.gc("data",e.data)("user",e.user)("emailValidation",e.emailValidation)("smsValidation",e.smsValidation)("mobilePhone",e.mobilePhone)("landLinePhone",e.landLinePhone)("defineAddress",e.defineAddress)("address",e.address)("customValues",e.customValues)}}function E(e,i){if(1&e){const e=a.Rb();a.Qb(0,"action-button",25),a.Xb("action",(function(){a.sc(e);const t=i.$implicit;return a.Zb(4).transition(t)})),a.ac(1,"async"),a.Pb()}if(2&e){const e=i.$implicit,t=a.Zb(4);a.gc("disabled",a.bc(1,2,t.requesting$))("label",e.label)}}function S(e,i){if(1&e&&(a.Qb(0,"div",23),a.Bc(1,E,2,4,"action-button",24),a.Pb()),2&e){const e=a.Zb(3);a.xb(1),a.gc("ngForOf",e.transitions)}}function T(e,i){if(1&e){const e=a.Rb();a.Qb(0,"action-button",26),a.Xb("action",(function(){a.sc(e);const i=a.Zb(3);return i.transition(i.singleTransition)})),a.ac(1,"async"),a.Pb()}if(2&e){const e=a.Zb(3);a.gc("disabled",a.bc(1,2,e.requesting$))("label",e.i18n.general.finish)}}function z(e,i){if(1&e){const e=a.Rb();a.Qb(0,"action-button",26),a.Xb("action",(function(){return a.sc(e),a.Zb(3).externalRedirect()})),a.ac(1,"async"),a.Pb()}if(2&e){const e=a.Zb(3);a.gc("disabled",a.bc(1,2,e.requesting$))("label",e.i18n.general.next)}}function L(e,i){if(1&e){const e=a.Rb();a.Qb(0,"action-button",26),a.Xb("action",(function(){a.sc(e);const i=a.Zb(4);return i.transition(i.singleTransition)})),a.ac(1,"async"),a.Pb()}if(2&e){const e=a.Zb(4);a.gc("disabled",a.bc(1,2,e.requesting$))("label",e.singleTransition.label)}}function O(e,i){1&e&&a.Lb(0,"span")}function Z(e,i){if(1&e&&(a.Ob(0),a.Bc(1,L,2,4,"action-button",27),a.Bc(2,O,1,0,"span",5),a.Nb()),2&e){const e=a.Zb(3);a.xb(1),a.gc("ngIf",e.singleTransition),a.xb(1),a.gc("ngIf",!e.singleTransition)}}const k=function(e,i){return{current:e,total:i}};function R(e,i){if(1&e&&(a.Qb(0,"div",28),a.Dc(1),a.Pb()),2&e){const e=a.Zb(3);a.xb(1),a.Fc(" ",e.i18n.wizard.currentStep(a.kc(1,k,e.data.stepNumber,e.data.stepCount))," ")}}function B(e,i){if(1&e){const e=a.Rb();a.Qb(0,"action-button",29),a.Xb("action",(function(){return a.sc(e),a.Zb(3).back()})),a.ac(1,"async"),a.Pb()}if(2&e){const e=a.Zb(3);a.gc("disabled",a.bc(1,2,e.requesting$))("label",e.i18n.general.back)}}function F(e,i){1&e&&a.Lb(0,"div")}function V(e,i){if(1&e&&(a.Ob(0),a.Bc(1,w,3,3,"alert",6),a.Qb(2,"div",7),a.Bc(3,C,1,2,"run-wizard-step-group",8),a.Bc(4,P,1,1,"run-wizard-step-idp",9),a.Bc(5,A,1,9,"run-wizard-step-fields",10),a.Bc(6,S,2,1,"div",11),a.Pb(),a.Qb(7,"actions",12),a.Bc(8,T,2,4,"action-button",13),a.Bc(9,z,2,4,"action-button",13),a.Bc(10,Z,3,2,"ng-container",14),a.Bc(11,R,2,4,"div",15),a.Bc(12,B,2,4,"action-button",16),a.Bc(13,F,1,0,"ng-template",null,17,a.Cc),a.Pb(),a.Nb()),2&e){const e=a.qc(14),i=a.Zb(2);a.xb(1),a.gc("ngIf",i.informationText),a.xb(2),a.gc("ngIf",i.data.step.kind===i.WizardStepKind.GROUP),a.xb(1),a.gc("ngIf",i.data.step.kind===i.WizardStepKind.IDENTITY_PROVIDER),a.xb(1),a.gc("ngIf",i.data.step.kind===i.WizardStepKind.FORM_FIELDS&&i.data.action!==i.WizardActionEnum.ALREADY_EXECUTED),a.xb(1),a.gc("ngIf",(null==i.transitions?null:i.transitions.length)>0),a.xb(1),a.gc("ngSwitch",i.data.action),a.xb(1),a.gc("ngSwitchCase",i.WizardActionEnum.FINISH),a.xb(1),a.gc("ngSwitchCase",i.WizardActionEnum.EXTERNAL_REDIRECT),a.xb(2),a.gc("ngIf",null!=i.data.stepCount),a.xb(1),a.gc("ngIf",i.showBack)("ngIfElse",e)}}function N(e,i){if(1&e&&(a.Qb(0,"page-content",4),a.ac(1,"async"),a.Bc(2,V,15,11,"ng-container",5),a.ac(3,"async"),a.Pb()),2&e){const e=a.Zb();a.gc("heading",e.data.step.title)("mobileHeading",e.data.step.title)("mode",a.bc(1,5,e.layout.ltsm$)?"fullHeight":"normal")("hideBack",e.showBack),a.xb(2),a.gc("ngIf",!1===a.bc(3,7,e.updating$))}}function Q(e,i){if(1&e&&(a.Ob(0),a.Lb(1,"p",19),a.ac(2,"trust"),a.Lb(3,"p",19),a.ac(4,"trust"),a.Qb(5,"p"),a.Dc(6),a.Pb(),a.Nb()),2&e){const e=a.Zb(2);a.xb(1),a.gc("innerHTML",a.bc(2,3,e.registrationMessage),a.tc),a.xb(2),a.gc("innerHTML",a.bc(4,5,e.registrationPrincipals),a.tc),a.xb(3),a.Ec(e.registrationPasswords)}}function D(e,i){if(1&e&&(a.Qb(0,"div",34),a.Dc(1),a.Pb()),2&e){const e=a.Zb(2);a.xb(1),a.Ec(e.resultMessage)}}function H(e,i){if(1&e&&a.Lb(0,"rich-text-container",35),2&e){const e=a.Zb(2);a.gc("value",e.resultMessage)}}function q(e,i){if(1&e&&(a.Qb(0,"page-content",30),a.ac(1,"async"),a.Bc(2,Q,7,7,"ng-container",31),a.Bc(3,D,2,1,"div",32),a.Bc(4,H,1,1,"rich-text-container",33),a.Pb()),2&e){const e=a.Zb();a.gc("heading",e.resultTitle)("mobileHeading",e.mobileResultTitle)("mode",a.bc(1,7,e.layout.ltsm$)?"fullHeight":"normal")("ngSwitch",e.data.resultType),a.xb(2),a.gc("ngSwitchCase",e.WizardResultTypeEnum.REGISTRATION),a.xb(1),a.gc("ngSwitchCase",e.WizardResultTypeEnum.PLAIN_TEXT),a.xb(1),a.gc("ngSwitchCase",e.WizardResultTypeEnum.RICH_TEXT)}}let M=(()=>{class e extends f.a{constructor(e,i,t,n){super(e),this.userHelper=i,this.nextRequestState=t,this.wizardsService=n,this.WizardStepKind=s.bc,this.WizardResultTypeEnum=s.ac,this.WizardActionEnum=s.Yb,this.updating$=new y.a(!1)}ngOnInit(){super.ngOnInit();const e=this.route.snapshot,i=e.params.key,t=e.params.user,n=e.params.menu,a=e.params.wizard;let s;if(i){const e="wizard-execution-"+i,t=this.stateManager.getGlobal(e);t?(this.stateManager.deleteGlobal(e),this.data=t):this.addSub(this.wizardsService.getCurrentWizardExecution({key:i}).subscribe(e=>this.data=e))}else s=t?this.wizardsService.startUserWizard({user:t,key:a}):n?this.wizardsService.startMenuWizard({menu:n}):this.wizardsService.startWizard({key:a,inviteToken:p.a.get("inviteToken")}),this.addSub(s.subscribe(e=>{this.stateManager.setGlobal("wizard-execution-"+e.key,e),this.data=e}))}onDataInitialized(e){if(this.route.snapshot.params.key!==e.key)return this.breadcrumb.pop(),void this.router.navigate(["wizards","run",e.key],{replaceUrl:!0});this.key=e.key,this.data$.subscribe(e=>this.update(e))}update(e){if(this.updating$.next(!0),this.showBack=((e=e||{}).path||[]).length>0,e.step){const i=e.transitions||[];this.singleTransition=1===i.length?i[0]:null,this.transitions=i.length>1?i:null,this.informationText=e.action===s.Yb.ALREADY_EXECUTED?this.i18n.wizard.alreadyExecuted:e.step.informationText,setTimeout(()=>{this.setupForms(e),this.updating$.next(!1)})}else if(e.resultType)switch(this.informationText=null,e.resultType){case s.ac.REGISTRATION:const i=e.registrationResult;this.registrationMessage=this.userHelper.registrationMessageHtml(i,!1),this.registrationPrincipals=this.userHelper.registrationPrincipalsHtml(i),this.registrationPasswords=this.userHelper.registrationPasswordsMessage(i),p.a.remove("inviteToken",{path:"/"});break;case s.ac.PLAIN_TEXT:this.resultMessage=(e.result||"").split("\n").join("<br>");break;case s.ac.RICH_TEXT:this.resultMessage=e.result||""}}setupForms(e){if(this.group=null,this.user=null,this.emailValidation=null,this.smsValidation=null,this.mobilePhone=null,this.landLinePhone=null,this.customValues=null,this.address=null,this.defineAddress=null,null!=e.step){const i=e.step;switch(i.kind){case s.bc.GROUP:this.group=this.formBuilder.control(e.params.group,u.F.required);break;case s.bc.FORM_FIELDS:if(this.customValues=this.fieldHelper.customValuesFormGroup(i.customFields||[],{currentValues:(e.params||{}).customValues}),e.wizard.kind===s.Zb.REGISTRATION){const t=i.dataForNew,n=e.params.user;let a;t.user=n,e.step.validateEmail&&(this.emailValidation=new u.j(null,u.F.required)),e.step.validateSms&&(this.smsValidation=new u.j(null,u.F.required)),t.phoneConfiguration&&(Object(c.i)(n.mobilePhones)||(t.phoneConfiguration.mobilePhone=n.mobilePhones[0]),Object(c.i)(n.landLinePhones)||(t.phoneConfiguration.landLinePhone=n.landLinePhones[0])),t.addressConfiguration&&(Object(c.i)(n.addresses)||(t.addressConfiguration.address=n.addresses[0])),this.user=this.formBuilder.group({group:n.group,hiddenFields:[n.hiddenFields||[]]}),[this.mobilePhone,this.landLinePhone]=this.userHelper.setupRegistrationForm(this.user,t,!0),t.imageConfiguration.availability!==s.h.DISABLED&&this.user.addControl("images",new u.j([])),[this.address,this.defineAddress,a]=this.userHelper.registrationAddressForm(t.addressConfiguration),this.defineAddress&&!Object(c.i)(n.addresses)&&this.defineAddress.setValue(!0),a.forEach(e=>this.addSub(e));const o=this.userHelper.passwordRegistrationForms(t);if(this.user.addControl("passwords",this.formBuilder.array(o)),Object(c.i)(t.securityQuestions)||(this.user.setControl("securityQuestion",this.formBuilder.control(n.securityQuestion)),this.user.setControl("securityAnswer",this.formBuilder.control(n.securityAnswer,this.userHelper.securityAnswerValidation))),Object(c.i)(t.agreements)||this.user.setControl("acceptAgreements",this.formBuilder.control(n.acceptAgreements)),t.captchaType){const e=this.authHelper.captchaFormGroup();n.captcha&&e.patchValue(n.captcha),this.user.setControl("captcha",e)}}}}}resolveMenu(e){var i;const t=e.wizard;switch(t.kind){case s.Zb.REGISTRATION:return m.b.RUN_REGISTRATION_WIZARD;case s.Zb.SYSTEM:return new m.a(this.menu.menuForWizard(t),{wizard:t});case s.Zb.USER:return this.menu.userMenu(e.user,new m.a(this.menu.menuForWizard(t),{wizard:t}));case s.Zb.MENU:const n=this.ApiHelper.internalNameOrId(e.menuItem);return null===(i=this.menu.contentPageEntry(n))||void 0===i?void 0:i.activeMenu}}back(){this.addSub(this.wizardsService.backWizardExecution({key:this.key}).subscribe(e=>this.data=e))}transition(e){this.validateAndSubmit(()=>this.addSub(this.wizardsService.transitionWizardExecution({key:this.key,transition:e?e.id:null,body:this.data.params}).subscribe(e=>this.data=e)))}externalRedirect(){this.validateAndSubmit(()=>this.addSub(this.wizardsService.redirectWizardExecution({key:this.key,body:this.data.params}).subscribe(e=>{this.nextRequestState.willExternalRedirect(),window.location.assign(e)})))}validateAndSubmit(e){const i=this.data.params;switch(this.data.step.kind){case s.bc.GROUP:if(!Object(c.I)(this.group))return void Object(c.m)();i.group=this.group.value,e();break;case s.bc.IDENTITY_PROVIDER:e();break;case s.bc.FORM_FIELDS:const t=new u.m({});this.customValues&&t.addControl("customValues",this.customValues),this.data.wizard.kind===s.Zb.REGISTRATION&&(this.user&&t.addControl("user",this.user),this.emailValidation&&this.user.contains("email")&&!this.emailAlreadyVerified&&t.addControl("emailValidation",this.emailValidation),this.mobilePhone&&!this.smsAlreadyVerified&&t.addControl("mobilePhone",this.mobilePhone),this.smsValidation&&this.mobilePhone&&!this.smsAlreadyVerified&&t.addControl("smsValidation",this.smsValidation),this.landLinePhone&&t.addControl("landLinePhone",this.landLinePhone),this.address&&this.defineAddress.value&&t.addControl("address",this.address));const n=Object(c.I)(t,!0);this.addSub(Object(c.w)(n).subscribe(t=>{if(t){if(i.customValues=this.customValues?this.customValues.value:null,this.data.wizard.kind===s.Zb.REGISTRATION){const e=this.user?Object.assign({},this.user.value):{};if(this.mobilePhone){const i=this.mobilePhone.value||{};i.number&&(e.mobilePhones=[i])}if(this.landLinePhone){const i=this.landLinePhone.value||{};i.number&&(e.landLinePhones=[i])}if(this.address){const i=this.defineAddress&&this.defineAddress.value?this.address.value:null;i&&(e.addresses=[i])}i.user=e,this.emailValidation&&!this.emailAlreadyVerified&&(i.emailVerification=this.emailValidation.value),this.smsValidation&&!this.smsAlreadyVerified&&(i.smsVerification=this.smsValidation.value)}e()}else Object(c.m)()}))}}get emailAlreadyVerified(){if(!this.user||!this.data.step)return!1;const e=this.data.step.verifiedEmail,i=this.user.value.email;return!Object(c.i)(e)&&e===i}get smsAlreadyVerified(){if(!this.mobilePhone||!this.data.step)return!1;const e=this.data.step.verifiedSms,i=this.mobilePhone.value.number;return!Object(c.i)(e)&&this.userHelper.phoneNumberMatches(e,i)}continueWithProvider(e){this.authHelper.identityProviderPopup(e,"wizard",null,this.key).pipe(Object(v.a)()).subscribe(e=>{switch(e.status){case s.G.WIZARD:this.data=e.wizardExecutionData;break;default:this.notification.error(e.errorMessage||this.i18n.error.general)}})}get resultTitle(){return this.data.resultType===s.ac.REGISTRATION?this.i18n.user.title.registrationDone:this.data.resultTitle}get mobileResultTitle(){return this.data.resultType===s.ac.REGISTRATION?this.i18n.user.mobileTitle.registrationDone:this.data.resultTitle}}return e.\u0275fac=function(i){return new(i||e)(a.Kb(a.r),a.Kb(g.a),a.Kb(b.a),a.Kb(r.a))},e.\u0275cmp=a.Eb({type:e,selectors:[["run-wizard"]],features:[a.ub],decls:8,vars:7,consts:[["size","large",3,"ready"],[4,"ngIf","ngIfThen"],["step",""],["result",""],["last","",3,"heading","mobileHeading","mode","hideBack"],[4,"ngIf"],["type","info",4,"ngIf"],[1,"flex-grow-1"],[3,"groups","control",4,"ngIf"],[3,"identityProviders","continue",4,"ngIf"],[3,"data","user","emailValidation","smsValidation","mobilePhone","landLinePhone","defineAddress","address","customValues",4,"ngIf"],["class","d-flex flex-column mt-3 mt-md-4",4,"ngIf"],["forceRow","",3,"ngSwitch"],[3,"disabled","label","action",4,"ngSwitchCase"],[4,"ngSwitchDefault"],["class","d-flex align-items-center justify-content-center py-2",4,"ngIf"],["outline","",3,"disabled","label","action",4,"ngIf","ngIfElse"],["noBack",""],["type","info"],[3,"innerHTML"],[3,"groups","control"],[3,"identityProviders","continue"],[3,"data","user","emailValidation","smsValidation","mobilePhone","landLinePhone","defineAddress","address","customValues"],[1,"d-flex","flex-column","mt-3","mt-md-4"],["type","button","class","centered-button",3,"disabled","label","action",4,"ngFor","ngForOf"],["type","button",1,"centered-button",3,"disabled","label","action"],[3,"disabled","label","action"],[3,"disabled","label","action",4,"ngIf"],[1,"d-flex","align-items-center","justify-content-center","py-2"],["outline","",3,"disabled","label","action"],["last","","hideBack","",3,"heading","mobileHeading","mode","ngSwitch"],[4,"ngSwitchCase"],["class","break-nl",4,"ngSwitchCase"],[3,"value",4,"ngSwitchCase"],[1,"break-nl"],[3,"value"]],template:function(e,i){if(1&e&&(a.Qb(0,"page-layout",0),a.ac(1,"async"),a.Bc(2,I,1,0,"ng-container",1),a.Bc(3,x,1,0,"ng-container",1),a.Pb(),a.Bc(4,N,4,9,"ng-template",null,2,a.Cc),a.Bc(6,q,5,9,"ng-template",null,3,a.Cc)),2&e){const e=a.qc(5),t=a.qc(7);a.gc("ready",a.bc(1,5,i.data$)),a.xb(2),a.gc("ngIf",null==i.data?null:i.data.step)("ngIfThen",e),a.xb(1),a.gc("ngIf",null==i.data?null:i.data.resultType)("ngIfThen",t)}},encapsulation:2,changeDetection:0}),e})();var U=t("HDdC"),W=t("LRne"),G=t("ofXK"),$=t("z332"),j=t("DIHi"),K=t("JFlR"),X=t("Ls5z"),_=t("pBnU"),Y=t("sGzL"),J=t("csas"),ee=t("yHfF"),ie=t("N7zh"),te=t("CyT4"),ne=t("OTwK"),ae=t("Y+zs"),se=t("WYBn"),oe=t("chz4"),re=t("T6RQ"),le=t("g9Ug");function ce(e,i){if(1&e&&(a.Ob(0),a.Lb(1,"images-field",5),a.Nb()),2&e){const e=a.Zb().ngIf,i=a.Zb();a.xb(1),a.gc("label",1===e.imageConfiguration.maxImages?i.i18n.user.title.image:i.i18n.user.title.images)("formControl",i.user.controls.images)("maxFiles",e.imageConfiguration.maxImages)("initialImages",e.images)("target",i.TempImageTargetEnum.USER_REGISTRATION)}}function de(e,i){if(1&e&&(a.Qb(0,"label-value",8),a.Lb(1,"user-link",9),a.Pb()),2&e){const e=a.Zb(3);a.gc("label",e.i18n.user.broker),a.xb(1),a.gc("user",e.data.step.dataForNew.broker)}}function ue(e,i){if(1&e&&(a.Ob(0),a.Bc(1,de,2,2,"label-value",6),a.Lb(2,"input-field",7),a.Nb()),2&e){const e=a.Zb().ngIf,i=a.Zb();a.xb(1),a.gc("ngIf",i.data.step.dataForNew.broker),a.xb(1),a.gc("formControl",i.user.controls.name)("label",e.nameLabel)}}function be(e,i){if(1&e&&(a.Ob(0),a.Lb(1,"input-field",7),a.Nb()),2&e){const e=a.Zb(2);a.xb(1),a.gc("formControl",e.user.controls.username)("label",e.i18n.user.username)}}function ge(e,i){if(1&e&&a.Lb(0,"field-privacy",14),2&e){const e=a.Zb(3);a.gc("control",e.user.controls.hiddenFields)}}function fe(e,i){if(1&e){const e=a.Rb();a.Qb(0,"label-value",15),a.Qb(1,"div",16),a.Qb(2,"div",17),a.Lb(3,"input-field",18),a.Pb(),a.Qb(4,"div",19),a.Qb(5,"countdown-button",20,21),a.Xb("action",(function(){a.sc(e);const i=a.qc(6);return a.Zb(3).sendEmailCode(i)})),a.Pb(),a.Pb(),a.Pb(),a.Pb()}if(2&e){const e=a.Zb(3);a.gc("label",e.i18n.wizard.emailVerificationCode),a.xb(3),a.gc("formControl",e.emailValidation),a.xb(2),a.gc("label",e.i18n.general.sendCode)("disabledSeconds",5)("disabledKey",e.codeSentMessage)}}function me(e,i){if(1&e&&(a.Ob(0),a.Qb(1,"label-value",10),a.Lb(2,"input-field",11),a.Bc(3,ge,1,1,"field-privacy",12),a.Pb(),a.Bc(4,fe,7,5,"label-value",13),a.Nb()),2&e){const e=a.Zb(2);a.xb(1),a.gc("label",e.i18n.user.email)("ignoreExtraCell",!e.emailPrivacy)("required",e.emailAvailability===e.AvailabilityEnum.REQUIRED),a.xb(1),a.gc("formControl",e.user.controls.email),a.xb(2),a.gc("ngIf",e.step.validateEmail&&!e.runWizard.emailAlreadyVerified)}}function he(e,i){if(1&e&&a.Lb(0,"field-privacy",25),2&e){const e=a.Zb(3);a.gc("control",e.mobilePhone.controls.hidden)}}function pe(e,i){if(1&e){const e=a.Rb();a.Qb(0,"label-value",15),a.Qb(1,"div",16),a.Qb(2,"div",17),a.Lb(3,"input-field",18),a.Pb(),a.Qb(4,"div",19),a.Qb(5,"countdown-button",20,26),a.Xb("action",(function(){a.sc(e);const i=a.qc(6);return a.Zb(3).sendSmsCode(i)})),a.Pb(),a.Pb(),a.Pb(),a.Pb()}if(2&e){const e=a.Zb(3);a.gc("label",e.i18n.wizard.smsVerificationCode),a.xb(3),a.gc("formControl",e.smsValidation),a.xb(2),a.gc("label",e.i18n.general.sendCode)("disabledSeconds",30)("disabledKey",e.codeSentMessage)}}function ye(e,i){if(1&e&&(a.Ob(0),a.Qb(1,"label-value",22),a.Lb(2,"input-field",23),a.Bc(3,he,1,1,"field-privacy",24),a.Pb(),a.Bc(4,pe,7,5,"label-value",13),a.Nb()),2&e){const e=a.Zb().ngIf,i=a.Zb();a.xb(1),a.gc("label",i.i18n.phone.mobile)("required",i.mobileAvailability===i.AvailabilityEnum.REQUIRED)("ignoreExtraCell",!i.phonePrivacy),a.xb(1),a.gc("formControl",i.mobilePhone.controls.number)("placeholder",e.phoneConfiguration.mobileExample),a.xb(2),a.gc("ngIf",i.step.validateSms&&!i.runWizard.smsAlreadyVerified)}}function ve(e,i){if(1&e&&a.Lb(0,"field-privacy",25),2&e){const e=a.Zb(3);a.gc("control",e.landLinePhone.controls.hidden)}}function Ie(e,i){if(1&e&&a.Lb(0,"input-field",28),2&e){const e=a.Zb(3);a.gc("formControl",e.landLinePhone.controls.extension)("label",e.i18n.phone.extension)}}function xe(e,i){if(1&e&&(a.Ob(0),a.Qb(1,"label-value",22),a.Lb(2,"input-field",23),a.Bc(3,ve,1,1,"field-privacy",24),a.Pb(),a.Bc(4,Ie,1,2,"input-field",27),a.Nb()),2&e){const e=a.Zb().ngIf,i=a.Zb();a.xb(1),a.gc("label",i.i18n.phone.landLine)("required",i.landLineAvailability===i.AvailabilityEnum.REQUIRED)("ignoreExtraCell",!i.phonePrivacy),a.xb(1),a.gc("formControl",i.landLinePhone.controls.number)("placeholder",e.phoneConfiguration.landLineExample),a.xb(2),a.gc("ngIf",e.phoneConfiguration.extensionEnabled)}}function we(e,i){if(1&e&&a.Lb(0,"boolean-field",32),2&e){const e=a.Zb(3);a.gc("formControl",e.defineAddress)("label",e.i18n.user.addressDefine)}}function Ce(e,i){if(1&e&&a.Lb(0,"address-form",33),2&e){const e=a.Zb(2).ngIf,i=a.Zb();a.gc("addressForm",i.address)("configuration",e.addressConfiguration)("managePrivacy",e.addressConfiguration.managePrivacy)}}function Pe(e,i){if(1&e){const e=a.Rb();a.Qb(0,"static-map",37),a.Xb("imageLoaded",(function(){return a.sc(e),a.Zb(4).mapShown()})),a.Pb()}if(2&e){const e=a.Zb(4);a.gc("address",e.address.value)}}function Ae(e,i){if(1&e){const e=a.Rb();a.Qb(0,"action-button",38),a.Xb("action",(function(){return a.sc(e),a.Zb(4).locateAddress()})),a.ac(1,"async"),a.Pb()}if(2&e){const e=a.Zb(4);a.gc("disabled",a.bc(1,2,e.locatingAddress$))("label",e.i18n.general.mapView)}}function Ee(e,i){if(1&e&&(a.Qb(0,"label-value",34),a.Bc(1,Pe,1,1,"static-map",35),a.Bc(2,Ae,2,4,"ng-template",null,36,a.Cc),a.Pb()),2&e){const e=a.qc(3),i=a.Zb(3);a.gc("label",i.i18n.general.map),a.xb(1),a.gc("ngIf",null!=i.address.get("location").value.latitude)("ngIfElse",e)}}function Se(e,i){if(1&e&&(a.Ob(0),a.Bc(1,we,1,2,"boolean-field",29),a.Bc(2,Ce,1,3,"address-form",30),a.Bc(3,Ee,4,3,"label-value",31),a.Nb()),2&e){const e=a.Zb(2);a.xb(1),a.gc("ngIf",e.addressAvailability===e.AvailabilityEnum.OPTIONAL),a.xb(1),a.gc("ngIf",e.defineAddress.value),a.xb(1),a.gc("ngIf",e.defineAddress.value&&e.maps.enabled)}}function Te(e,i){if(1&e&&(a.Qb(0,"label-value",40),a.Lb(1,"custom-field-input",41),a.Pb()),2&e){const e=i.$implicit,t=a.Zb(2).ngIf,n=a.Zb();a.gc("label",e.name)("kind","field")("fieldSize",n.fieldSize(e))("required",e.required)("labelPosition","boolean"===e.type?"sideForced":"auto"),a.xb(1),a.gc("field",e)("binaryValues",t.binaryValues)("formControl",n.customProfileValues.controls[e.internalName])}}function ze(e,i){if(1&e&&(a.Ob(0),a.Bc(1,Te,2,8,"label-value",39),a.Nb()),2&e){const e=a.Zb().ngIf;a.xb(1),a.gc("ngForOf",e.customFields)}}function Le(e,i){1&e&&a.Mb(0)}function Oe(e,i){if(1&e&&a.Lb(0,"boolean-field",47),2&e){const e=a.Zb(5);a.gc("label",e.i18n.user.registration.passwordForceChange)}}function Ze(e,i){if(1&e&&(a.Ob(0,0),a.Lb(1,"input-field",44),a.Lb(2,"input-field",45),a.Bc(3,Oe,1,1,"boolean-field",46),a.Nb()),2&e){const e=i.ngIf,t=a.Zb().$implicit,n=a.Zb(3);a.gc("formGroup",e),a.xb(1),a.gc("label",t.name),a.xb(1),a.gc("label",n.i18n.user.passwordConfirmation(t.name)),a.xb(1),a.gc("ngIf",t.canForceChange)}}function ke(e,i){if(1&e&&(a.Ob(0),a.Bc(1,Ze,4,4,"ng-container",43),a.Nb()),2&e){const e=i.index,t=a.Zb(3);a.xb(1),a.gc("ngIf",t.passwordForm(e))}}function Re(e,i){if(1&e&&(a.Ob(0),a.Bc(1,ke,2,1,"ng-container",42),a.Nb()),2&e){const e=a.Zb().ngIf;a.xb(1),a.gc("ngForOf",e.passwordTypes)}}function Be(e,i){if(1&e&&a.Lb(0,"field-option",51),2&e){const e=i.$implicit;a.gc("value",e.internalName)("text",e.name)}}function Fe(e,i){if(1&e&&a.Lb(0,"input-field",52,53),2&e){const e=a.Zb(3);a.gc("formControl",e.user.controls.securityAnswer)("label",e.i18n.securityQuestion.answer)}}function Ve(e,i){if(1&e&&(a.Ob(0),a.Qb(1,"single-selection-field",48),a.Bc(2,Be,1,2,"field-option",49),a.Pb(),a.Bc(3,Fe,2,2,"input-field",50),a.ac(4,"async"),a.Nb()),2&e){const e=a.Zb().ngIf,i=a.Zb();a.xb(1),a.gc("formControl",i.user.controls.securityQuestion)("label",i.i18n.securityQuestion.question)("emptyOption",i.i18n.user.securityQuestionEmpty),a.xb(1),a.gc("ngForOf",e.securityQuestions),a.xb(1),a.gc("ngIf",!i.empty(a.bc(4,5,i.user.get("securityQuestion").valueChanges)))}}function Ne(e,i){if(1&e&&(a.Ob(0),a.Qb(1,"label-value",34),a.Lb(2,"accept-agreements",54),a.Pb(),a.Nb()),2&e){const e=a.Zb().ngIf,i=a.Zb();a.xb(1),a.gc("label",i.i18n.user.profile.agreements),a.xb(1),a.gc("agreements",e.agreements)("formControl",i.user.controls.acceptAgreements)}}function Qe(e,i){if(1&e&&(a.Ob(0),a.Qb(1,"label-value",15),a.Lb(2,"captcha",55),a.Pb(),a.Nb()),2&e){const e=a.Zb(2);a.xb(1),a.gc("label",e.i18n.user.captcha),a.xb(1),a.gc("form",e.user.controls.captcha)}}function De(e,i){if(1&e&&(a.Ob(0),a.Bc(1,ce,2,5,"ng-container",3),a.Bc(2,ue,3,3,"ng-container",3),a.Bc(3,be,2,2,"ng-container",3),a.Bc(4,me,5,5,"ng-container",3),a.Bc(5,ye,5,6,"ng-container",3),a.Bc(6,xe,5,6,"ng-container",3),a.Bc(7,Se,4,3,"ng-container",3),a.Bc(8,ze,2,1,"ng-container",3),a.Bc(9,Le,1,0,"ng-container",4),a.Bc(10,Re,2,1,"ng-container",3),a.Bc(11,Ve,5,7,"ng-container",3),a.Bc(12,Ne,3,3,"ng-container",3),a.Bc(13,Qe,3,2,"ng-container",3),a.Nb()),2&e){const e=i.ngIf,t=a.Zb(),n=a.qc(3);a.xb(1),a.gc("ngIf",null==e.profileFieldActions||null==e.profileFieldActions.image?null:e.profileFieldActions.image.edit),a.xb(1),a.gc("ngIf",null==e.profileFieldActions||null==e.profileFieldActions.name?null:e.profileFieldActions.name.edit),a.xb(1),a.gc("ngIf",(null==e.profileFieldActions||null==e.profileFieldActions.username?null:e.profileFieldActions.username.edit)&&!e.generatedUsername),a.xb(1),a.gc("ngIf",t.emailAvailability!==t.AvailabilityEnum.DISABLED),a.xb(1),a.gc("ngIf",t.mobileAvailability!==t.AvailabilityEnum.DISABLED),a.xb(1),a.gc("ngIf",t.landLineAvailability!==t.AvailabilityEnum.DISABLED),a.xb(1),a.gc("ngIf",t.defineAddress&&t.addressAvailability!==t.AvailabilityEnum.DISABLED),a.xb(1),a.gc("ngIf",t.customProfileValues),a.xb(1),a.gc("ngTemplateOutlet",n),a.xb(1),a.gc("ngIf",(null==e.passwordTypes?null:e.passwordTypes.length)>0),a.xb(1),a.gc("ngIf",(null==e.securityQuestions?null:e.securityQuestions.length)>0),a.xb(1),a.gc("ngIf",!t.empty(e.agreements)),a.xb(1),a.gc("ngIf",e.captchaType)}}function He(e,i){if(1&e&&(a.Qb(0,"label-value",40),a.Lb(1,"custom-field-input",41),a.Pb()),2&e){const e=i.$implicit,t=a.Zb(3);a.gc("label",e.name)("kind","field")("fieldSize",t.fieldSize(e))("required",e.required)("labelPosition","boolean"===e.type?"sideForced":"auto"),a.xb(1),a.gc("field",e)("binaryValues",t.data.binaryValues)("formControl",t.customValues.controls[e.internalName])}}function qe(e,i){if(1&e&&(a.Ob(0),a.Bc(1,He,2,8,"label-value",39),a.Nb()),2&e){const e=a.Zb(2);a.xb(1),a.gc("ngForOf",e.data.step.customFields)}}function Me(e,i){if(1&e&&a.Bc(0,qe,2,1,"ng-container",3),2&e){const e=a.Zb();a.gc("ngIf",e.customValues)}}let Ue=(()=>{class e extends l.a{constructor(e,i,t,n,o,r){super(e),this.changeDetector=i,this.imagesService=t,this.maps=n,this.wizardsService=o,this.runWizard=r,this.AvailabilityEnum=s.h,this.TempImageTargetEnum=s.xb,this.empty=c.i,this.imageUploaded=new a.n,this.imageRemoved=new a.n,this.customImagesUploaded=new a.n,this.customFilesUploaded=new a.n,this.emailAvailability=s.h.DISABLED,this.mobileAvailability=s.h.DISABLED,this.landLineAvailability=s.h.DISABLED,this.addressAvailability=s.h.DISABLED,this.image$=new y.a(null),this.location$=new y.a(null),this.locatingAddress$=new y.a(!1)}get user(){return this._user}set user(e){this._user=e,this.customProfileValues=e?e.controls.customValues:null}get image(){return this.image$.value}set image(e){this.image$.next(e)}get location(){return this.location$.value}set location(e){this.location$.next(e)}ngOnInit(){if(super.ngOnInit(),this.step=this.data.step,this.data.wizard.kind===s.Zb.REGISTRATION){const e=this.step.dataForNew||{},i=e.profileFieldActions||{};i.email&&(this.emailAvailability=e.emailRequired?s.h.REQUIRED:s.h.OPTIONAL,this.emailPrivacy=i.email.managePrivacy),i.phone&&e.phoneConfiguration&&(this.mobileAvailability=e.phoneConfiguration.mobileAvailability,this.landLineAvailability=e.phoneConfiguration.landLineAvailability,this.phonePrivacy=i.phone.managePrivacy),i.address&&e.addressConfiguration&&(this.addressAvailability=e.addressConfiguration.availability)}}onUploadDone(e){this.addSub(this.doRemoveImage().subscribe(()=>{this.image=e,this.imageUploaded.emit(this.image),this.changeDetector.detectChanges()}))}removeImage(){this.addSub(this.doRemoveImage().subscribe())}doRemoveImage(){if(this.image){const e=this.image;return this.errorHandler.requestWithCustomErrorHandler(()=>new U.a(i=>{this.imagesService.deleteImage({idOrKey:this.image.id}).subscribe(()=>{this.imageRemoved.emit(this.image),this.image=null,this.changeDetector.detectChanges(),i.next(e)})}))}return Object(W.a)(null)}locateAddress(){const e=this.address.value;this.locatingAddress$.next(!0),this.addSub(this.maps.geocode(e).subscribe(e=>{this.address.patchValue({location:e}),this.changeDetector.detectChanges()},()=>this.mapShown()))}mapShown(){this.locatingAddress$.next(!1),this.changeDetector.detectChanges()}passwordForm(e){const i=this.user?this.user.controls.passwords:null;return i?i.controls[e]:null}sendEmailCode(e){this.doSendCode(e,this.user.controls.email,s.sb.EMAIL)}sendSmsCode(e){this.doSendCode(e,this.mobilePhone.controls.number,s.sb.SMS)}get codeSentMessage(){return()=>this.i18n.wizard.codeSent}doSendCode(e,i,t){const n=Object(c.I)(i,!0);Object(c.w)(n).subscribe(n=>{const a=i.value;n?this.addSub(this.wizardsService.sendWizardVerificationCode({key:this.data.key,body:{medium:t,to:a}}).subscribe(()=>{this.notification.snackBar(this.i18n.general.sentCodeTo(a))})):(e.reenable(),Object(c.m)())})}fieldSize(e){return this.fieldHelper.fieldSize(e)}}return e.\u0275fac=function(i){return new(i||e)(a.Kb(a.r),a.Kb(a.h),a.Kb(o.a),a.Kb(d.a),a.Kb(r.a),a.Kb(M))},e.\u0275cmp=a.Eb({type:e,selectors:[["run-wizard-step-fields"]],inputs:{data:"data",user:"user",mobilePhone:"mobilePhone",landLinePhone:"landLinePhone",defineAddress:"defineAddress",address:"address",customValues:"customValues",emailValidation:"emailValidation",smsValidation:"smsValidation",image:"image"},outputs:{imageUploaded:"imageUploaded",imageRemoved:"imageRemoved",customImagesUploaded:"customImagesUploaded",customFilesUploaded:"customFilesUploaded"},features:[a.ub],decls:4,vars:2,consts:[[3,"formGroup"],[4,"ngIf","ngIfElse"],["customFieldsTpl",""],[4,"ngIf"],[4,"ngTemplateOutlet"],["avatarSize","large",3,"label","formControl","maxFiles","initialImages","target"],[3,"label",4,"ngIf"],["required","",3,"formControl","label"],[3,"label"],["hideLink","",3,"user"],["kind","field",3,"label","ignoreExtraCell","required"],[3,"formControl"],["field","email",3,"control",4,"extraCell"],["kind","field","required","",3,"label",4,"ngIf"],["field","email",3,"control"],["kind","field","required","",3,"label"],[1,"row","no-gutters","w-100"],[1,"col-6","col-md-4"],["size","full",3,"formControl"],[1,"col-6","col-md-8","pl-2"],[3,"label","disabledSeconds","disabledKey","action"],["emailCode",""],["kind","field",3,"label","required","ignoreExtraCell"],[3,"formControl","placeholder"],[3,"control",4,"extraCell"],[3,"control"],["smsCode",""],["fieldSize","tiny",3,"formControl","label",4,"ngIf"],["fieldSize","tiny",3,"formControl","label"],["switch","",3,"formControl","label",4,"ngIf"],["ignoreContactFields","",3,"addressForm","configuration","managePrivacy",4,"ngIf"],["kind","field",3,"label",4,"ngIf"],["switch","",3,"formControl","label"],["ignoreContactFields","",3,"addressForm","configuration","managePrivacy"],["kind","field",3,"label"],[3,"address","imageLoaded",4,"ngIf","ngIfElse"],["viewMap",""],[3,"address","imageLoaded"],["outline","",3,"disabled","label","action"],[3,"label","kind","fieldSize","required","labelPosition",4,"ngFor","ngForOf"],[3,"label","kind","fieldSize","required","labelPosition"],["hideLabel","",3,"field","binaryValues","formControl"],[4,"ngFor","ngForOf"],[3,"formGroup",4,"ngIf"],["required","","formControlName","value","type","password","autocomplete","new-password",3,"label"],["required","","formControlName","confirmationValue","type","password","autocomplete","new-password",3,"label"],["formControlName","forceChange",3,"label",4,"ngIf"],["formControlName","forceChange",3,"label"],[3,"formControl","label","emptyOption"],[3,"value","text",4,"ngFor","ngForOf"],[3,"formControl","label",4,"ngIf"],[3,"value","text"],[3,"formControl","label"],["securityAnswer",""],[3,"agreements","formControl"],[3,"form"]],template:function(e,i){if(1&e&&(a.Qb(0,"form",0),a.Bc(1,De,14,13,"ng-container",1),a.Bc(2,Me,1,1,"ng-template",null,2,a.Cc),a.Pb()),2&e){const e=a.qc(3);a.xb(1),a.gc("ngIf",i.user&&i.data.step.dataForNew)("ngIfElse",e)}},directives:[u.H,u.v,u.n,G.t,G.A,$.a,u.u,u.k,j.a,u.C,K.a,X.a,_.a,Y.a,J.a,ee.a,ie.a,te.a,ne.a,G.s,ae.a,u.l,se.a,oe.a,re.a,le.a],pipes:[G.b],encapsulation:2,changeDetection:0}),e})();var We=t("wR2l");function Ge(e,i){if(1&e&&a.Lb(0,"field-option",4),2&e){const e=i.$implicit;a.gc("value",e.id)("id",e.id)("internalName",e.internalName)("text",e.name)}}function $e(e,i){if(1&e&&(a.Qb(0,"radio-group-field",2),a.Bc(1,Ge,1,4,"field-option",3),a.Pb()),2&e){const e=a.Zb();a.gc("formControl",e.control),a.xb(1),a.gc("ngForOf",e.groups)}}function je(e,i){if(1&e&&(a.Qb(0,"div",13),a.Dc(1),a.Pb()),2&e){const e=a.Zb().$implicit;a.xb(1),a.Fc(" ",e.description," ")}}function Ke(e,i){if(1&e&&(a.Qb(0,"div",6),a.Qb(1,"div",7),a.Qb(2,"div",8),a.Lb(3,"input",9),a.Qb(4,"label",10),a.Qb(5,"div",11),a.Dc(6),a.Bc(7,je,2,1,"div",12),a.Pb(),a.Pb(),a.Pb(),a.Pb(),a.Pb()),2&e){const e=i.$implicit,t=a.Zb(2);a.xb(3),a.gc("formControl",t.control)("id","group_"+e.id)("value",e.internalName||e.id),a.xb(1),a.gc("for","group_"+e.id),a.xb(2),a.Fc(" ",e.name," "),a.xb(1),a.gc("ngIf",e.description)}}function Xe(e,i){if(1&e&&a.Bc(0,Ke,8,6,"div",5),2&e){const e=a.Zb();a.gc("ngForOf",e.groups)}}let _e=(()=>{class e extends l.a{constructor(e){super(e)}ngOnInit(){super.ngOnInit(),this.singleLine=this.groups.length<=3&&0===this.groups.filter(e=>e.description).length}}return e.\u0275fac=function(i){return new(i||e)(a.Kb(a.r))},e.\u0275cmp=a.Eb({type:e,selectors:[["run-wizard-step-group"]],inputs:{groups:"groups",control:"control"},features:[a.ub],decls:3,vars:2,consts:[[3,"formControl",4,"ngIf","ngIfElse"],["multiLine",""],[3,"formControl"],[3,"value","id","internalName","text",4,"ngFor","ngForOf"],[3,"value","id","internalName","text"],["class","row mb-2",4,"ngFor","ngForOf"],[1,"row","mb-2"],[1,"col-12","col-6","col-sm-8"],[1,"custom-control","custom-radio"],["type","radio",1,"custom-control-input",3,"formControl","id","value"],[1,"custom-control-label",3,"for"],[1,"ml-1"],["class","text-muted mt-1 mb-3",4,"ngIf"],[1,"text-muted","mt-1","mb-3"]],template:function(e,i){if(1&e&&(a.Bc(0,$e,2,2,"radio-group-field",0),a.Bc(1,Xe,1,1,"ng-template",null,1,a.Cc)),2&e){const e=a.qc(2);a.gc("ngIf",i.singleLine)("ngIfElse",e)}},directives:[G.t,We.a,u.u,u.k,G.s,oe.a,u.z,u.e],encapsulation:2,changeDetection:0}),e})();var Ye=t("cyUc");function Je(e,i){if(1&e&&a.Lb(0,"img",4),2&e){const e=a.Zb().$implicit;a.gc("src",e.image.url,a.uc)("alt",e.name)}}const ei=function(e,i,t){return{border:e,background:i,color:t}};function ii(e,i){if(1&e){const e=a.Rb();a.Qb(0,"button",1),a.Xb("click",(function(){a.sc(e);const t=i.$implicit;return a.Zb().registerWith(t)})),a.Bc(1,Je,1,2,"img",2),a.Lb(2,"span",3),a.ac(3,"trust"),a.Pb()}if(2&e){const e=i.$implicit,t=a.Zb();a.gc("ngStyle",a.lc(5,ei,"1px solid "+e.borderColor,e.backgroundColor,e.textColor)),a.xb(1),a.gc("ngIf",e.image),a.xb(1),a.gc("innerHTML",a.bc(3,3,t.i18n.identityProvider.login(e.name)),a.tc)}}let ti=(()=>{class e extends l.a{constructor(e){super(e),this.continue=new a.n}registerWith(e){this.continue.emit(e)}}return e.\u0275fac=function(i){return new(i||e)(a.Kb(a.r))},e.\u0275cmp=a.Eb({type:e,selectors:[["run-wizard-step-idp"]],inputs:{identityProviders:"identityProviders"},outputs:{continue:"continue"},features:[a.ub],decls:1,vars:1,consts:[["type","button","class","identity-provider centered-button",3,"ngStyle","click",4,"ngFor","ngForOf"],["type","button",1,"identity-provider","centered-button",3,"ngStyle","click"],["class","aria-hidden",3,"src","alt",4,"ngIf"],[3,"innerHTML"],[1,"aria-hidden",3,"src","alt"]],template:function(e,i){1&e&&a.Bc(0,ii,4,9,"button",0),2&e&&a.gc("ngForOf",i.identityProviders)},directives:[G.s,G.w,G.t],pipes:[Ye.a],encapsulation:2,changeDetection:0}),e})(),ni=(()=>{class e extends f.a{constructor(e,i){super(e),this.wizardsService=i}ngOnInit(){const e=this.route.snapshot;super.ngOnInit(),this.addSub(this.wizardsService.runWizardCallback({key:e.params.key,body:{method:"GET",parameters:e.queryParams}}).subscribe(e=>{this.stateManager.setGlobal("wizard-execution-"+e.key,e),this.router.navigate(["wizards","run",e.key],{replaceUrl:!0})}))}resolveMenu(){return null}}return e.\u0275fac=function(i){return new(i||e)(a.Kb(a.r),a.Kb(r.a))},e.\u0275cmp=a.Eb({type:e,selectors:[["wizard-callback"]],features:[a.ub],decls:0,vars:0,template:function(e,i){},encapsulation:2,changeDetection:0}),e})();var ai=t("tyNb"),si=t("IbW5");const oi=[{path:"",children:[{path:"system/:wizard",component:M,canActivate:[si.a]},{path:"registration/:wizard",component:M},{path:"user/:user/:wizard",component:M,canActivate:[si.a]},{path:"menu/:menu/:wizard",component:M},{path:"run/:key",component:M},{path:"callback/:key",component:ni}]}];let ri=(()=>{class e{}return e.\u0275mod=a.Ib({type:e}),e.\u0275inj=a.Hb({factory:function(i){return new(i||e)},imports:[[ai.i.forChild(oi)],ai.i]}),e})();var li=t("psEu"),ci=t("K3ix"),di=t("s3T5"),ui=t("Lm2G"),bi=t("yyhP"),gi=t("mzC4"),fi=t("Mfq2"),mi=t("dZIy"),hi=t("ojQa"),pi=t("QKVY"),yi=t("yThH"),vi=t("cvAk"),Ii=t("vdzA"),xi=t("H4pW"),wi=t("Wpnw"),Ci=t("sifq"),Pi=t("oj/z"),Ai=t("UXR7"),Ei=t("o/nJ"),Si=t("lS/A"),Ti=t("AH7H"),zi=t("5Wk5"),Li=t("nznZ"),Oi=t("lrfU"),Zi=t("aVfl"),ki=t("G1xJ"),Ri=t("VpKs"),Bi=t("yk18"),Fi=t("YG2p"),Vi=t("Xel3"),Ni=t("4APx"),Qi=t("nGVv"),Di=t("559x"),Hi=t("6g1M"),qi=t("0C6t"),Mi=t("iXUt"),Ui=t("uao2"),Wi=t("fe3a"),Gi=t("pz1b"),$i=t("bER3"),ji=t("ZJXG"),Ki=t("wUcZ"),Xi=t("yRWz"),_i=t("/edM"),Yi=t("JbOn"),Ji=t("vHbw"),et=t("USuC"),it=t("Y49Y"),tt=t("2V/7"),nt=t("HZ9B"),at=t("5pUo"),st=t("tjxP"),ot=t("jOM4"),rt=t("qONT"),lt=t("DFH8"),ct=t("bBjs"),dt=t("Zcpn"),ut=t("Aw04"),bt=t("TTRT"),gt=t("UnhA"),ft=t("eNTF"),mt=t("Kiu2"),ht=t("s7Af"),pt=t("vOpc"),yt=t("U4Kh"),vt=t("ugYG"),It=t("MNyf"),xt=t("IJ5G"),wt=t("iM3x"),Ct=t("x741"),Pt=t("3qho"),At=t("I0FJ"),Et=t("BTg0"),St=t("BUNh"),Tt=t("podT"),zt=t("Zilp"),Lt=t("oOvo"),Ot=t("L/K/"),Zt=t("Ae/X"),kt=t("IbGL"),Rt=t("7nZW"),Bt=t("XvX2"),Ft=t("9uOH"),Vt=t("9AzD"),Nt=t("+HmS"),Qt=t("dCJh"),Dt=t("yL40"),Ht=t("/kmK"),qt=t("g1uo"),Mt=t("cLCZ"),Ut=t("I9hm"),Wt=t("kmyw"),Gt=t("/NTq");let $t=(()=>{class e{}return e.\u0275mod=a.Ib({type:e}),e.\u0275inj=a.Hb({factory:function(i){return new(i||e)},imports:[[ri,n.a]]}),e})();a.vc(M,[ai.j,ai.f,ai.h,ai.g,ai.k,G.q,G.r,G.s,G.t,G.A,G.w,G.x,G.y,G.z,G.u,G.v,u.H,u.w,u.G,u.e,u.x,u.A,u.b,u.D,u.E,u.z,u.u,u.v,u.C,u.q,u.p,u.y,u.c,u.f,u.k,u.n,u.l,u.o,u.h,li.a,ci.c,ci.d,di.a,di.b,di.c,ui.a,ui.b,bi.a,bi.b,gi.a,fi.b,mi.b,mi.d,mi.a,hi.b,pi.a,yi.a,vi.a,Ii.a,xi.a,wi.a,Ci.a,Pi.a,Ai.a,Ei.a,Si.a,K.a,_.a,Ti.a,zi.a,Li.a,ee.a,j.a,Oi.a,Zi.a,ki.a,Ri.a,Bi.a,Fi.a,Vi.a,oe.a,se.a,Ni.a,Qi.a,We.a,Di.a,Hi.a,qi.a,Mi.a,ae.a,Ui.a,Wi.a,$.a,Gi.a,$i.a,ji.a,Ki.a,Xi.a,_i.a,Yi.a,Ji.a,et.a,it.a,tt.a,nt.a,le.a,at.a,st.a,ot.a,rt.a,lt.a,J.a,ne.a,ct.a,dt.a,ut.a,bt.a,gt.a,ie.a,Y.a,ft.a,mt.a,X.a,ht.a,pt.a,re.a,yt.a,vt.a,It.a,te.a,xt.a,wt.a,Ct.a,Pt.a,At.a,Et.a,St.a,Tt.a,zt.a,Lt.a,Ot.a,Zt.a,kt.a,Rt.a,Bt.a,Ft.a,Vt.a,Nt.a,Qt.a,M,_e,ti,Ue,ni],[G.b,G.G,G.p,G.k,G.E,G.g,G.C,G.F,G.d,G.f,G.i,G.j,G.l,Ye.a,Dt.a,Ht.a,qt.a,Mt.a,Ut.a,Wt.a,Gt.a])}}]);