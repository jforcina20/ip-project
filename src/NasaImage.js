import { LitElement, html, css } from 'lit';
import '@lrnwebcomponents/accent-card/accent-card.js';

export class NasaImage extends LitElement {
    static get tag() {
      return 'nasa-image-search';
    }

    constructor() {
        super();
        this.images = [];
        this.searchImages = true;
        this.listOnly = false;
        this.search = "Moon Landing";
    }

    static get properties() {
        return {
            images: {
                type: Array,
            },
            searchImages: {
                type: Boolean,
                reflect: true,
                attribute: 'search-images',
            },
            listOnly: {
              type: Boolean,
              reflect: true,
              attribute: 'list-only',
            },
            search: {type: String, reflect: true},
            }
        };
    
        updated(changedProperties) {
            changedProperties.forEach((oldValue, propName) => {
              if (propName === 'searchImages' && this[propName]) {
                this.getImages();
              }
              else if (propName === 'search') {
                this.dispatchEvent(
                  new CustomEvent('results-changed', {
                    detail: {
                      value: this.search,
                    },
                  })
                );
              }
            });
          }
        

    async getImages() {
        console.log(this.search);
        return fetch('https://images-api.nasa.gov/search?media_type=image&q=' + this.search)
        .then((response) => {
            if (response.ok) return response.json();
        })
        .then((data) => {
            this.images = [];
            var i = 0;
            while(i < data.collection.items.length) {
                const resultInfo = {
                    image: data.collection.items[i].links[0].href,
                    title: data.collection.items[i].data[0].title,
                    description: data.collection.items[i].data[0].description,
                    author: data.collection.items[i].data[0].secondary_creator,
                };
                i++;
                console.log(resultInfo);
                this.images.push(resultInfo);
            }

            setTimeout(() => {
                this.searchImages = false;
              }, 1000);
            
        });
    }

    render() {
      return html`
      ${this.listOnly === true
        ? html`
            <ul>
              ${this.images.map(
                item => html`
                  <li>
                    <b>Image URL: </b>${item.image} - <b>Title: </b>${item.title} - <b>Description: </b>${item.description} - <b>Credit:</b>${item.author}
                  </li>
                `
              )}
            </ul>
          `
        : html`
            ${this.images.map(
                item => html`
                    <accent-card image-src="${item.image}">
                        <div slot="heading">${item.title}</div>
                        <div slot="content">${item.description}</div>
                        <div slot="content">Credit: ${item.author}</div>
                    </accent-card>`
            )}`
    }`

  }
}

customElements.define(NasaImage.tag, NasaImage);
