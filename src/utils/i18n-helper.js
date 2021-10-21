import i18n from './i18n';
export function Localization(props){
   console.log(props);
   console.log(i18n.t(props));
   i18n.t(props);
}