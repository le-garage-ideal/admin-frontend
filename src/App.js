import React from 'react';
import { filter, } from 'rxjs/operators';
import { PickImages } from './components/PickImages';
import { CrudCars } from './components/CrudCars';
import { Menu, CHOOSE_IMAGES_MENU, CREATE_UPDATE_DELETE_VARIANTS } from './components/Menu';
import { sortBrands, sortModels } from './functions/sort';
import { fetchInitData, noCarImageMatch, selectCarImage, createCar, removeCar, computeSelectedCars } from './functions/car';
import { createBrand, updateBrand, deleteBrand } from './functions/brand';
import { createModel, updateModel, deleteModel } from './functions/model';
import { refreshCollection, refreshCollectionRemove } from './functions/collection';
import { authenticate, currentUserObservable } from './functions/api';
import { Login } from './components/Login';
import { Brand } from './components/Brand';
import { Model } from './components/Model';
import { EditableItem } from './components/EditableItem';
import './App.css';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      user: null,
      cars: [],
      brands: [],
      selectedBrand: null,
      selectedModels: [],
      selectedModel: null,
      selectedCars: [],
      selectedMenu: CREATE_UPDATE_DELETE_VARIANTS,
      errorMessage: null,
      displayAddBrand: false,
      displayAddModel: false,
    };

    this.loginProcess = this.loginProcess.bind(this);
    this.unselect = this.unselect.bind(this);
    this.refreshState = this.refreshState.bind(this);
    this.refreshState = this.refreshState.bind(this);
    this.refreshStateRemove = this.refreshStateRemove.bind(this);
  }

  componentDidMount() {
    currentUserObservable.pipe(
      filter(currentUser => !!currentUser),
    ).subscribe(user => {
      fetchInitData().then(initData => {
        this.setState({ ...initData, user });
      })
    });
  }

  loginProcess(authFields) {
    authenticate(authFields)
      .then(success => {
        currentUserObservable.next({
          username: success.username,
          token: success.token
        });
      })
      .catch(error => {
        this.setState({
          errorMessage: error.errorMessage
        });
      });
  }

  unselect(carId) {
    const indexCars = this.state.cars.findIndex(car => car._id === carId);
    const newCars = [...this.state.cars];
    newCars[indexCars].selectedFavcarsVariant = null;
    newCars[indexCars].selectedFavcarsImage = null;

    const indexSelectedCars = this.state.selectedCars.findIndex(car => car._id === carId);
    const newSelectedCars = [...this.state.selectedCars];
    newSelectedCars[indexSelectedCars].selectedFavcarsVariant = null;
    newSelectedCars[indexSelectedCars].selectedFavcarsImage = null;

    this.setState({cars: newCars, selectedCars: newSelectedCars})
  }

  refreshState(updatedCar) {
    const updatedCars = refreshCollection(updatedCar, this.state.cars);
    const updatedSelectedCars = this.state.selectedModel ? computeSelectedCars(updatedCars, this.state.selectedModel) : [];
    this.setState({selectedCars: updatedSelectedCars, cars: updatedCars});
  }

  refreshStateRemove(carId) {
    const updatedCars = refreshCollectionRemove(carId, this.state.cars);
    if (updatedCars) {
      const updatedSelectedCars = this.state.selectedModel ? computeSelectedCars(updatedCars, this.state.selectedModel) : [];
      this.setState({ selectedCars: updatedSelectedCars, cars: updatedCars });
    }
  }

  render() {

    const {
      user,
      selectedMenu,
      brands,
      brandMap,
      selectedBrand,
      models,
      modelMap,
      selectedModels,
      selectedModel,
      cars,
      selectedCars,
      errorMessage,
      displayAddBrand,
      displayAddModel,
    } = this.state;

    const brandElements = brands.sort(sortBrands).map(brand => (
      <Brand
        brand={brand}
        selectedBrand={selectedBrand}
        brandMap={brandMap}
        select={() => {
          const selectedModels = models.filter(model => model.brand.name === brand.name);
          this.setState({selectedBrand: brand, selectedModels, selectedCars: [], selectedModel: null});
        }}
        update={name => {
          updateBrand({...brand, name})
            .then(updatedBrand => this.setState({brands: refreshCollection(updatedBrand, brands)}));
        }}
        remove={() => {
          deleteBrand(brand)
            .then(() => this.setState({brands: refreshCollectionRemove(brand._id, brands)}));
        }}
      />
    ));

    if (displayAddBrand) {
      brandElements.push((
        <EditableItem
          key="add-brand"
          initValue=""
          initEdit={true}
          buttonClassNames={[]}
          itemUpdate={name => { createBrand(name).then(createdBrand => this.setState({brands: [...brands, createdBrand], displayAddBrand: false})); }}
          itemCancel={() => this.setState({displayAddBrand: false})}
        />
      ));
    } else {
      brandElements.push((
        <button className="add-button" onClick={() => this.setState({displayAddBrand: true})}>➕</button>
      ));
    }

    const modelElements = selectedModels.sort(sortModels).map(model => (
      <Model
        model={model}
        modelMap={modelMap}
        selectedModel={selectedModel}
        select={() => {
          const selectedCars = computeSelectedCars(cars, model);
            this.setState({selectedModel: model, selectedCars});
        }}
        update={name => {
          updateModel({...model, name})
            .then(updatedModel => this.setState({models: refreshCollection(updatedModel, models)}));
        }}
        remove={() => {
          deleteModel(model)
            .then(() => this.setState({models: refreshCollectionRemove(model._id, models)}));
        }}
      />
    ));

    if (selectedBrand) {
      if (displayAddModel) {
        modelElements.push((
          <EditableItem
            key="add-model"
            initValue=""
            initEdit={true}
            buttonClassNames={[]}
            itemUpdate={name => { createModel({brand: {name: selectedBrand.name}, name}).then(createdModel => this.setState({models: [...models, createdModel], displayAddModel: false})); }}
            itemCancel={() => this.setState({displayAddBrand: false})}
          />
        ));
      } else {
        modelElements.push((
          <button className="add-button" onClick={() => this.setState({displayAddModel: true})}>➕</button>
        ));
      }
    }


    let selectedMenuElement = null;
    switch (selectedMenu) {
      case CHOOSE_IMAGES_MENU:
        selectedMenuElement = (
          <PickImages
            selectedBrand={selectedBrand}
            selectedModel={selectedModel}
            selectedCars={selectedCars}
            nomatch={carId => noCarImageMatch(carId).then(updatedCar => this.refreshState(updatedCar))}
            select={(carId, variantName, url) => selectCarImage(carId, variantName, url).then(updatedCar => this.refreshState(updatedCar))}
            unselect={this.unselect}>
          </PickImages>
        );
        break;
      case CREATE_UPDATE_DELETE_VARIANTS:
        if (selectedModel) {
          selectedMenuElement = (
            <CrudCars 
              selectedModel={selectedModel}
              selectedCars={selectedCars}
              removeCar={carId => { removeCar(carId); this.refreshStateRemove(carId); }}
              createCar={car => { createCar(car); this.refreshState(car); }}>
            </CrudCars>
          );
        }
        break;
      default:
        selectedMenuElement = '';
    }

    const headerBrandModelElements = (
      <>
        { !!selectedMenu && <hr className="separator" />}
        <section className="item-button-container">{selectedMenu && brandElements}</section>
        { selectedModels.length > 0 && <hr className="separator" />}
        <section className="item-button-container">{modelElements}</section>
      </>
    );

    return (
      <div className="App">
        <header className="App-header">
          <section className="top">
            <section className="title-logo">
              <img alt="logo" src="logo.png" />
              <h1>
                Admin
                App
              </h1>
              {user && <div style={{ marginLeft: '10px' }}><span role="img" aria-label="Connected user">👤</span>{` ${user.username}`}</div>}
            </section>
            {user && <Menu menuSelect={selectedMenu => this.setState({ selectedMenu })} />}
          </section>
          {user && headerBrandModelElements}
        </header>
        <main className="App-main">
          {user && selectedMenuElement}
          {!user && <Login onSubmit={this.loginProcess} errorMessage={errorMessage} />}
        </main>
      </div>
    );
  }
}

export default App;
