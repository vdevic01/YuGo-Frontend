import {AfterViewInit, Component} from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import {MapService} from "../../services/map.service";
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit{
  private map:any;
  constructor(private mapService:MapService) {
  }
  private initMap():void{
    this.map = L.map('map', {
      center:[45.2396, 19.8227],
      scrollWheelZoom:false,
      zoom:13
    });
    const tiles = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 18,
        minZoom: 3,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }
    );
    tiles.addTo(this.map);
  }
  route(): void {
    L.Routing.control({
      waypoints: [L.latLng(57.74, 11.94), L.latLng(57.6792, 11.949)],
    }).addTo(this.map);
  }

  ngAfterViewInit(): void {
    let DefaultIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.6.0/dist/images/marker-icon.png',
    });

    L.Marker.prototype.options.icon = DefaultIcon;
    this.initMap();

    this.destinationPickerService.currentFromAddress.subscribe({
      next:(address?:Address) => {
        if(this.fromAddressMarker){
          this.map.removeControl(this.fromAddressMarker);
        }
        if(!address){
          this.fromAddressMarker = undefined;
          this.map.removeControl(this.path);
        }else{
          this.fromAddressMarker = L.marker([address.lat, address.long]).addTo(this.map);
        }
        this.checkForPath();
      }
    });
    this.destinationPickerService.currentToAddress.subscribe({
      next:(address?:Address) => {
        if(this.toAddressMarker){
          this.map.removeControl(this.toAddressMarker);
        }
        if(!address){
          this.toAddressMarker = undefined;
          this.map.removeControl(this.path);
        }else {
          this.toAddressMarker = L.marker([address.lat, address.long]).addTo(this.map);
        }
        this.checkForPath();
      }
    });
    this.destinationPickerService.enableManualFromAddressSelection.subscribe({
      next:()=>{
        this.canSelectFromAddress = true;
      }
    });
    this.destinationPickerService.enableManualToAddressSelection.subscribe({
      next:()=>{
        this.canSelectToAddress = true;
      }
    });
    this.map.on('click', (e:LeafletMouseEvent)=>{
      if(this.canSelectToAddress){
        if(this.toAddressMarker){
          this.map.removeControl(this.toAddressMarker);
        }
        this.toAddressMarker = L.marker(e.latlng).addTo(this.map);
        this.reverseAddressSearch(e.latlng.lat, e.latlng.lng).then((address:Address) => {
          this.destinationPickerService.manuallySelectedToAddress.next(address);
          this.canSelectToAddress = false;
          this.checkForPath();
        });
      }
      else if(this.canSelectFromAddress){
        if(this.fromAddressMarker){
          this.map.removeControl(this.fromAddressMarker);
        }
        this.fromAddressMarker = L.marker(e.latlng).addTo(this.map);
        this.reverseAddressSearch(e.latlng.lat, e.latlng.lng).then((address:Address)=>{
          this.destinationPickerService.manuallySelectedFromAddress.next(address);
          this.canSelectFromAddress = false;
          this.checkForPath();
        });
      }
    });
  }
  private checkForPath(){
    if(this.toAddressMarker && this.fromAddressMarker){
      let fromLatlng:any = this.fromAddressMarker.getLatLng();
      let toLatlng:any = this.toAddressMarker.getLatLng();
      this.route(fromLatlng.lat, fromLatlng.lng, toLatlng.lat, toLatlng.lng);
    }
  }
  private reverseAddressSearch(lat:number, lng:number): Promise<Address>{
    return new Promise<Address>( resolve => {
        let address:Address = {lat: 0, long: 0, name: ""};
        this.mapService.reverseSearch(lat, lng).subscribe((val:any) => {
          address.name = val.display_name;
          address.lat = lat;
          address.long = lng;
          resolve(address);
        });
      })

  }
}
