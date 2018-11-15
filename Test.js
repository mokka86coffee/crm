import React, { Component } from 'react';
import ReactDOM from "react-dom";
import  { createStore, combineReducers } from 'redux';
import  { connect } from 'react-redux';

import './Test.css';



//  Получаем котировки

let USD, EUR, USDTAPCO, EURTAPCO;    

fetch(`/2019/react/stanokCatalog.php?usd=true`)
      .then(response => response.json())
      .then(result => { 
       USD = result.Valute[10].Value.replace(',','.');
       EUR = result.Valute[11].Value.replace(',','.');
       USDTAPCO = result.Valute[0].Value.replace(',','.');
       EURTAPCO = result.Valute[1].Value.replace(',','.');
      })
      .catch(error => console.log(error));

//  Котировки получены



import { catalogZags, catalogPodZags, catalogPodZagsTovCats } from './categNames';


// catalogPodZags[Object.keys(catalogPodZags)[0]].forEach(el=>console.log(el));


// let initialState={};

// function addCar(state=initialState, action){
//     console.log(state);
//     console.log(action.type);
//     console.log(action.payload);
//     if (action.type === 'STATE_HERE') {
//       return {
//             ...state,
//             manya: action.payload
//       }
//     }
//     return state;
// };

// const store = createStore(addCateg);

// store.dispatch({type: 'STATE_HERE', payload: {manya: 'payload'}});

const masData = { 
    inpType: 'password'
};

let searchTerm = '';


class Test extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
            masData: {masData},
            nazvanie: '',
            val: '',
            h1:'Project',
            h1Style: {'':''},
            theFile:'',
            nazvStanka: '',
            stankiCategSite: {},
            isSentObj: false,
            passok: true,
            searchTerm: '',
            tabSiteLink: 'https://stanok74.ru',
            eurTapco: 0,
            usdTapco: 0,
            tapcoSent: {transform: 'rotateZ(0deg)'},
            fileXmlChng: false

        };

        this.onStanSubmit = this.onStanSubmit.bind(this);
        this.onInpChange = this.onInpChange.bind(this);
        this.onClkChoose = this.onClkChoose.bind(this);
        this.clickNazv = this.clickNazv.bind(this);
        this.onTabPriceChange = this.onTabPriceChange.bind(this); // Изменение цены
        this.onTabNalichieChange = this.onTabNalichieChange.bind(this); // Изменение наличия
        this.onTabStanSubmit = this.onTabStanSubmit.bind(this);
        this.onPassChange = this.onPassChange.bind(this);
        this.onClose = this.onClose.bind(this);
        this.onTabSearch = this.onTabSearch.bind(this);  // Поиск внутри таблицы по конкретным станкам
        this.tapcoSubmit = this.tapcoSubmit.bind(this);
        this.onInpFileChange = this.onInpFileChange.bind(this);
        this.onInpFileSubmit = this.onInpFileSubmit.bind(this);
    }


    onStanSubmit (e) {               // ------------- Отправка запроса на изменение цены станка
      e.preventDefault(); 
      let pr = e.target.nameStanka.value;

      let obj = JSON.stringify(pr);
      let chngFile = this.state.theFile;

      let form = {
        'textarea': obj,
        'pricelist': 'ok',
        'file': chngFile
      }

      let data = new FormData();
      data.append("text_area", JSON.stringify( form ));
      
      fetch('/2019/react/stanokCatalog.php', {        
        method: "POST",
        body: data
      })
      .then(response => response.json())
      .then(result => {
        console.log(result);
        this.setState({h1Style: {'color':'green'}, val: '', h1: 'Цены изменены', nazvanie: ''});
      })
      .catch(error => console.log(error))
    }

    clickNazv(e) {
      this.setState({nazvStanka: this.state.nazvanie, val: ''});
    }


    onInpChange (e) {               // -------------Ввод названия станка
          searchTerm = e.target.value;
          this.setState({val: e.target.value});          
    }

    onClkChoose (el,theFile, e) {               // -------------Чтение цен на станки
      let elLiElem = e.target;
      elLiElem.className = 'liload';
      setTimeout(()=>elLiElem.className = '', 1000);
      console.log(`/2019/react/stanokCatalog.php?tab=${catalogPodZagsTovCatsLinks[el]}&thefile=${theFile}`);
      fetch(`/2019/react/stanokCatalog.php?tab=${catalogPodZagsTovCatsLinks[el]}&thefile=${theFile}`)
      .then(function(response) {
        if (response.status === 200) return new Promise(function(resolve, reject) {
           resolve(response.json());
        });
      })
      .then(result => {
        console.log('------------------------------');
        console.log(result);
        console.log('------------------------------');
        let fileName = result[0].zag.toLowerCase();
        let tabLink = catalogPodZagsTovCatsLinks[el];
        console.log(catalogPodZagsTovCatsLinks[el]);
        this.setState({
          nazvanie: 'Файл открыт, ссылка - ', 
          h1:el, 
          stankiIshodnie: result, 
          stankiCategSite: result, 
          theFile: fileName, 
          isSentObj: true, 
          tabSiteLink: tabLink,
          eurTapco: EURTAPCO,
          usdTapco: USDTAPCO,
          tapcoSent: {transform: 'rotateZ(0deg)'},
          h1Style: {'':''}
        });
      })
      .catch(error => console.log(error))
    }
  
  onTabPriceChange (e ,el, index) {         // Изменение цены в всплывающей таблице
     
     let theFile = this.state.stankiCategSite[0].zag.toLowerCase();
     let updatedstankiCategSite = this.state.stankiCategSite;
     updatedstankiCategSite[index].cena=e.target.value;

     this.setState({stankiCategSite:updatedstankiCategSite});
  }
  
  onTabNalichieChange (e, index) {         // Изменение наличия в всплывающей таблице
     let theFile = this.state.stankiCategSite[0].zag.toLowerCase();
     let updatedstankiCategSite = this.state.stankiCategSite;
     updatedstankiCategSite[index].nalichie=e.target.value.replace('+','');

     this.setState({stankiCategSite:updatedstankiCategSite});
  }
    
  onTabStanSubmit (e) {               // ------------- Отправка запроса с объектом на изменение цены станка  
      let obj = JSON.stringify(this.state.stankiCategSite);
      let chngFile = this.state.theFile;

      let form = {
        'obj': obj,
        'chngFile': chngFile
      }

      let data = new FormData();
      data.append ("tab_stan_submit", JSON.stringify( form ))

      let oldObj = this.state.stankiIshodnie;
      let newObj = this.state.stankiCategSite;

      let arr = Array();
      newObj.forEach((el,i)=> {          
            if (el.cena !== oldObj[i].cena) arr.push(oldObj[i]);     
        }
      );

      fetch(`/2019/react/stanokCatalog.php`, {
        //  headers: {
        // 'Accept': 'application/json',
        // 'Content-Type': 'application/json'
        // },
        method: "POST",
        body: data
      })
      .then(response => response.json())
      .then(result => { 
        this.setState({isSentObj: false, onTabPriceChange: {}});
      })
      .catch(error => console.log(error))
    }
  
  onClose () {
    this.setState({isSentObj: false, searchTerm: ''});
  }

  onPassChange (e) {
    if ( (e.target.value.toLowerCase() === "кост") || (e.target.value.toLowerCase() === "rjcn") ) this.setState({passok: true})
  }

  onTabSearch (e) {
    this.setState({searchTerm:e.target.value});
  }

  tapcoSubmit(e) {
    e.preventDefault();
    let eurTapco = (e.target.eurTapco.value) ? e.target.eurTapco.value : e.target.eurTapco.placeholder;
    let usdTapco = (e.target.usdTapco.value) ? e.target.usdTapco.value : e.target.usdTapco.placeholder;
    
    console.log(`/2019/react/stanokCatalog.php?tapco=true&usdtapco=${usdTapco}&eurtapco=${eurTapco}`);
    fetch(`/2019/react/stanokCatalog.php?tapco=true&usdtapco=${usdTapco}&eurtapco=${eurTapco}`)
      .then(response => response.json())
      .then(result => { 
        this.setState({tapcoSent: {transform: 'rotateZ(360deg)'}});
      })
      .catch(error => console.log(error))

    this.setState({eurTapco, usdTapco});
  }

  onInpFileChange (e) {
    this.setState({fileXmlChng: true});
  }

  onInpFileSubmit(e) {
    
    e.preventDefault();
      

      let pr = e.target.userfile.files[0];
      let obj = JSON.stringify(pr);
      let chngFile = this.state.theFile;

      let form = {
        'file': pr
      }

      let data = new FormData();
      data.append('file', new Blob([pr]));
      // data.append("xml", pr);
      
      fetch('/2019/react/stanokCatalog.php', {        
        method: "POST",
        body: data
      })
      .then(response => response.json())
      .then(result => {   
        console.log(result);
        this.setState({fileXmlChng: false, h1: 'Файл загружен', nazvanie: ''});        
      })
      .catch(error => console.log(error))
}

  render(){
    const {masData, nazvanie, val, h1, stankiCategSite, password, passok, isSentObj, searchTerm, tabSiteLink, eurTapco, usdTapco, tapcoSent, h1Style, fileXmlChng } = this.state;
    
      
    if (!passok) return (
          <input className="all" type="text" onKeyDown={e=>this.onPassChange(e)}/>
    );

    let fileChngStyle = '', fileSubmitStyle = '' ;
    if (fileXmlChng) { fileSubmitStyle = {display: 'block'}; fileChngStyle= {display: 'none'}; }
    else { fileChngStyle = {display: 'block'}; fileSubmitStyle= {display: 'none'}; }



    return (
      <div className="block">
              <div className="sidebar">
                   <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAM4SURBVGhD7ZnLy01RHIY/9zspCUkxUW65ZkIoAzExMTHyDzBhwEAZmJCSiRFlIpcJA0kZGqAkKRnILQNkgMTE9X2O/ctqWWvvtS9nn/3VeerJt377nPPt99v7PWefbWTIkG4wXW6UY3qrUcwi+Vu+kqdkaqhNkufd6a3+X7eOBXFNCdXZIB/kSfkyW5uxUJ0N8rq3+ssGWRRqczbrdBCXWKiP2b/3JEeq80FcYqF47rXs51ERxCUW6pMs8+7XGH6QsXJ2wJkyxnp5Qr6QbqhLsjX8ILb2fSxTINR5yXNuMGgLP8gC+TzgTZmKFX+gQZrADzJVLilwrqyFH2S8DP2iFDma4AfZJVnneVHWIrUjKfofjhZkmwydrvhe8tjGg8Q6kuIVCWU6slf2JUgThIL4PbFO9C1IUUcWSpgo/W2xjoDfE9vxvgUp6oh9nqyR/rZYR6D1IPPkgxwvS1gtH8nUjjBzX+e4hEpBxsl1kp0w2upIjEpBZkmexIWd4Qfh3CdsFZdKCAXhd7uPXSyhb0GKOpJnax1JCVLUkTzPSehEkCYIBWHmhi5ddis4bpE86Yszs7/UW2fmu0zCFBnabuZ1JEZyEDsKdbTPjpUytN3M60jtsluQ7/J2Se9KnmtB+OWhx5mnJfSlI6FepGJHIPXbodFKEK6ltmduZZAxWdqcHYEmg3Azwj16RyRUDmJrdwbu54e9g+UF4WYEO7xc+ndLQkFiVA4yTdpf5TqDDC6rbW4vGgrCTh+S3yTb8KFcJY1QkDnSjjiukDCwjuyXzH7I+/JNtn4n2VkIBelURybJz/Kn3MFATJB2l5F7W9BKkDod4QOP9bPe6h87JfNbvVU4SONl5yvn1cwLDDI4LWx+loHwg8yQvyRXBtx9NA5KHpd3rRVjYB3hDYIZ/dgnj0krPndLIBRkvtzjyBGCykE4p+3FdjPI4EjZnPMZQkH4Xv5EMnclkNH5jhi8MbDjbOM/f7h2cmklSJ2OuNjO2oWiSyjIWmmvjwckDKwjRtkgMUoH+SqtA6nauxGnmr/tqGTbU2fmb7MgftFdz8hSQQahBfH7EbIwiNuJtj0swe9HSOvMkCFDkhgZ+QObj5rcgptcoAAAAABJRU5ErkJggg=="/>
                   <p>WebStanokPriceApp</p>
                   <form onSubmit={e=>this.onInpFileSubmit(e)} className="xml" encType="multipart/form-data" action="https://stanok74.ru/2019/react/stanokCatalog.php" method="POST">
                      <input type="hidden" name="MAX_FILE_SIZE" value="30000" />
                      <input style={fileChngStyle} onChange={e=>this.onInpFileChange(e)} name="userfile" type="file" />
                      <input style={fileSubmitStyle} type="submit" value="" />
                   </form>
              </div>
              <Input 
                 onInputChange={this.onInpChange}                 
                 onStanSubmit={this.onStanSubmit}
                 nazvanie={nazvanie}
                 val={val} 
                 onClkChoose={this.onClkChoose}
                 h1={h1}
                 h1Style = {h1Style}
                 clickNazv = {this.clickNazv}
                 stankiCategSite = {stankiCategSite}
                 onTabPriceChange = {this.onTabPriceChange}
                 onTabNalichieChange = {this.onTabNalichieChange}
                 onTabStanSubmit = {this.onTabStanSubmit}
                 isSentObj = {isSentObj}
                 onClose = {this.onClose}
                 onTabSearch = {this.onTabSearch}
                 searchTerm = {searchTerm}
                 tabSiteLink = {tabSiteLink}
                 tapcoSubmit = {this.tapcoSubmit}
                 eurTapco = {eurTapco}
                 usdTapco = {usdTapco}
                 tapcoSent={tapcoSent}
              />
      </div>
    )
  }
}


function Input (props) {
    const {
      inpData, onStanSubmit, nazvanie, onInputChange, val, onClkChoose, h1, 
      clickNazv, stankiCategSite, onTabPriceChange, onTabNalichieChange, onTabStanSubmit, isSentObj, onClose, onTabSearch, searchTerm, tabSiteLink,
      tapcoSubmit, eurTapco, usdTapco, tapcoSent, h1Style } = props;

    let classTablica = (isSentObj) ? 'tablica_visible tablica' : 'tablica';
    
    return (
      <div className="block1">
        <div className={classTablica}>
           <a className="close" onClick={onClose}>X</a>
           <a href={tabSiteLink} target="_blank" className="tabSiteLink">В категорию</a>
           <input
             value={searchTerm}
             type="text" 
             className="searchIns" 
             placeholder="Введите название" 
             onInput = {e=>onTabSearch(e)}
            />
           <div className="box-scroll">
              <Tablica 
                 stankiCategSite = {stankiCategSite} 
                 onTabPriceChange={onTabPriceChange}
                 onTabNalichieChange={onTabNalichieChange}
                 searchTerm={searchTerm}
              />
            </div>
            <table className="tabcopy"><tbody>
                <TabCopy
                 stankiCategSite = {stankiCategSite}
                />
            </tbody></table>
           <input onClick={e=>onTabStanSubmit(e)} type="submit" className="myButton"/>
           <form onSubmit={e=>tapcoSubmit(e)} className="tapcoForm">
             <label>USDTapco: <input name="usdTapco" className="usdTapco tapco" placeholder={usdTapco}/></label>
             <label>EURTapco: <input name="eurTapco" className="eurTapco tapco" placeholder={eurTapco}/></label>
             <button style={tapcoSent} className="tapcoSubmit"></button>             
           </form>
        </div>

        <div className="catalog">
           <ul>
              <Catalog onClkChoose={onClkChoose} />
           </ul>
        </div>  
        <h1 style={h1Style}> {h1} </h1>
         <p onClick={clickNazv}>{nazvanie}<a href={tabSiteLink} target="_blank">{(h1==='Файл загружен' || h1==='Project' || h1==='Цены изменены') ? '' : h1}</a></p>    
        <form onSubmit={onStanSubmit}>
         <textarea onChange={onInputChange} value={val} name="nameStanka" type="text"/>
         <button className="textareaSubmit" type="submit"></button>
        </form>
       
      </div>
    )
}

function Tablica (props) {
  let {stankiCategSite, onTabPriceChange, onTabNalichieChange, searchTerm} = props;

  let categElems = Array.from(stankiCategSite);
  
  let i = 0;

  for (i in stankiCategSite) {}  
  if (i < 1) return null;

console.log('Tablica');
  
  
  return (
           categElems // .toLowerCase().includes(searchTerm.toLowerCase())
           .map(function(el,i) {
            
            if (el.nazv !== undefined) {

            let display = {display: 'none'};
            if ( el.nazv.toLowerCase().includes(searchTerm.toLowerCase()) ) display = {display: 'block'}; 
            
            let sklad = '',utoch = '',zakaz = '';

            if (el.nalichie === 'На складе') {sklad='opmax';}
            else if (el.nalichie === 'Уточняйте') {utoch='opmax';}
            else if (el.nalichie === 'Под заказ') {zakaz='opmax';}


            return  (
             <div className="stroka" key={el.nazv+i} style={display}>
               <em>{el.nazv}</em>
               <input onChange={e => onTabPriceChange(e,el,i)} type="text" index={i} placeholder={el.cena} />
               <em><b>$</b> {Math.floor(el.cena/USD)}</em>
               <em><b>€</b> {Math.floor(el.cena/EUR)}</em> 
               <div className="nalichie">
                   <label className={sklad}><input onChange={e=>onTabNalichieChange(e,i)} value="+На складе" name="nalichie" type="radio" /></label>
                   <label className={utoch}><input onChange={e=>onTabNalichieChange(e,i)} value="+Уточняйте" name="nalichie" type="radio" /></label>
                   <label className={zakaz}><input onChange={e=>onTabNalichieChange(e,i)} value="+Под заказ" name="nalichie" type="radio" /></label>                 
               </div>
             </div>
            )            
           }})
  )
}

function TabCopy (props) {
  let {stankiCategSite} = props;

  if (Array.from(stankiCategSite).length<1) return null;
  
  let categElems = Array.from(stankiCategSite);
  
  let display = {display: 'none'};
  
  return (
     categElems 
           .map(function(el,i) {
            
            // if ( el.nazv.toLowerCase().includes(searchTerm.toLowerCase()) ) display = {display: 'block'};                           
            if (el.nazv !== undefined) {

            return  (
             <tr className="tr" key={el.nazv+i}>
               <td>{el.nazv}</td>
               <td>{el.cena}</td>
               <td>{el.nalichie}</td>
             </tr>
            )            
           }})
  )

}

function Catalog (props) {
  const {onClkChoose} = props;
  if (Array.from(catalogZags).length == 0) return null; 
  return (
    catalogZags.map((el,i)=>
        <li key={el+i}> 
           {el}
           <ul><CatalogPzags zag={el} onClkChoose={onClkChoose} /> </ul>
        </li>
    )
  )         
  
}

function CatalogPzags (props) {
       const {zag, onClkChoose} = props;
    if (catalogPodZags[zag] == undefined) return null; 
       return catalogPodZags[zag].map((el,i)=>
        <li key={el+i}>
          {el}
          <ul><CatalogPzagsTovCats obreZag={zag.substr(0,2) + zag.substr(zag.length-3,1) + '_'+el.substr(0,2) + el.substr(el.length-3,1)+'__'} podzag={el} onClkChoose={onClkChoose} /></ul>
        </li>
       )       
}

function CatalogPzagsTovCats (props) {
    const {podzag, onClkChoose, obreZag} = props;
    if (catalogPodZagsTovCats[podzag] == undefined) return null; 
    return  catalogPodZagsTovCats[podzag].map( function(el,i) {
       let nazFile = (obreZag+el.replace(/[\\\/\s]/img,'')).toLowerCase();
       return <li onClick={e=>onClkChoose(el,nazFile, e)} key={el+i}>{el}</li>
     }
    )  
}


export default Test;

ReactDOM.render(<Test />, document.querySelector("#app"));
if (module.hot) {
module.hot.accept();
}