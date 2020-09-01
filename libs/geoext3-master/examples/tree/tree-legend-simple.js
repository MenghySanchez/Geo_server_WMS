Ext.require([
    'GeoExt.component.Map',
    'GeoExt.data.store.LayersTree'
]);

/**
 * A plugin for Ext.grid.column.Column s that overwrites the internal cellTpl to
 * support legends.
 */
Ext.define('BasicTreeColumnLegends', {
    extend: 'Ext.AbstractPlugin',
    alias: 'plugin.basic_tree_column_legend',

    /**
     * @private
     */
    originalCellTpl: Ext.clone(Ext.tree.Column.prototype.cellTpl).join(''),

    /**
     * The Xtemplate strings that will be used instead of the plain {value}
     * when rendering
     */
    valueReplacementTpl: [
        '{value}',
        '<tpl if="this.hasLegend(values.record)"><br />',
        '<tpl for="lines">',
        '<img src="{parent.blankUrl}"',
        ' class="{parent.childCls} {parent.elbowCls}-img ',
        '{parent.elbowCls}-<tpl if=".">line<tpl else>empty</tpl>"',
        ' role="presentation"/>',
        '</tpl>',
        '<img src="{blankUrl}" class="{childCls} x-tree-elbow-img">',
        '<img src="{blankUrl}" class="{childCls} x-tree-elbow-img">',
        '<img src="{blankUrl}" class="{childCls} x-tree-elbow-img">',
        '{[this.getLegendHtml(values.record)]}',
        '</tpl>'
    ],

    /**
     * The context for methods available in the template
     */
    valueReplacementContext: {
        hasLegend: function(rec) {
            var isChecked = rec.get('checked');
            var layer = rec.data;
            return isChecked && !(layer instanceof ol.layer.Group);
        },
        getLegendHtml: function(rec) {
            var layer = rec.data;
            var legendUrl = layer.get('legendUrl');
            if (!legendUrl) {
                legendUrl = 'https://geoext.github.io/geoext2/' +
                    'website-resources/img/GeoExt-logo.png';
            }
            return '<img class="legend" src="' + legendUrl + '" height="32" />';
        }
    },

    init: function(column) {
        var me = this;
        if (!(column instanceof Ext.grid.column.Column)) {
            Ext.log.warn('Plugin shall only be applied to instances of' +
                    ' Ext.grid.column.Column');
            return;
        }
        var valuePlaceHolderRegExp = /\{value\}/g;
        var replacementTpl = me.valueReplacementTpl.join('');
        var newCellTpl = me.originalCellTpl.replace(
            valuePlaceHolderRegExp, replacementTpl
        );

        column.cellTpl = [
            newCellTpl,
            me.valueReplacementContext
        ];
    }
});

var mapComponent;
var mapPanel;
var treePanel;
var treePanel2;

Ext.application({
    name: 'LegendTrees',
    launch: function() {
        var source1;
        var source2;
        var source3;
        
        var source5;         /* enlaces de las capas 5 */
        var source6;         /* enlaces de las capas 6 */
        var source7;         /* enlaces de las capas 7 */
        var source8;         /* enlaces de las capas 8 */
        var source9;         /* enlaces de las capas 9 */
        var source10;
        var source11;
        var source12;
        var source13;
        var source14;
        var source15;
        var source16;
        var source17;
        var source18;
        var source19;
        var source20;
        var source21;
        var source22;
        var source23;
        var source24;
        var source25;
        var source26;

        var layer1;
        var layer2;
        var layer3;
        var layer4;
        var group;
        var olMap;
        var treeStore;
        var treeStore2;

        var layer5;        /* provincias */
        var layer6;        /* cantones  */
        var layer7;        /* parroquias */
        var layer8;        /* curvas de nivel */
        var layer9;        /* zona urbana */
        var layer10;       /* sendero */
        var layer11;       /* via */
        var layer12;       /* puente_p */
        var layer13;       /* granjas acuaticas */
        var layer14;       /* lagos y lagunas */
        var layer15;       /* rio i */
        var layer16;       /* rio Atacames */
        var layer17;       /* rio Sua */
        var layer18;       /* linea costa */
        var layer19;       /* nombres area */
        var layer20;       /* poblado p */
        var layer21;       /* estadio */
        var layer22;       /* edificio p */
        var layer23;       /* casa p */
        var layer24;       /* cancha a */
        var layer25;       /* malecon */
        var layer26;       /* faro */


        source1 = new ol.source.Stamen({layer: 'watercolor'});
        layer1 = new ol.layer.Tile({
            legendUrl: 'https://stamen-tiles-d.a.ssl.fastly.net/' +
                'watercolor/2/1/0.jpg',
            source: source1,
            name: 'Relleno de oceanos y continentes'
        });

        source2 = new ol.source.Stamen({layer: 'terrain-labels'});
        layer2 = new ol.layer.Tile({
            legendUrl: 'https://stamen-tiles-b.a.ssl.fastly.net/' +
                'terrain-labels/4/4/6.png',
            source: source2,
            name: 'Nombres de Paises y Provincias y Cantones'
        });

        source3 = new ol.source.TileWMS({
            url: 'https://ows.terrestris.de/osm-gray/service',
            params: {'LAYERS': 'OSM-WMS', 'TILED': true}
        });

        layer3 = new ol.layer.Tile({
            legendUrl: 'https://ows.terrestris.de/osm-gray/service?' +
                'SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image%2Fpng&' +
                'TRANSPARENT=true&LAYERS=OSM-WMS&TILED=true&WIDTH=256&' +
                'HEIGHT=256&CRS=EPSG%3A3857&STYLES=&' +
                'BBOX=0%2C0%2C10018754.171394622%2C10018754.171394622',
            source: source3,
            name: 'terrestris OSM WMS',
            visible: false
        });

        layer4 = new ol.layer.Vector({
            source: new ol.source.Vector(),
            name: 'Vector '
        });

        /*carga Provincias */
        source5 = new ol.source.TileWMS({
            url: 'http://localhost:8080/geoserver/WMS_LinearLab/wms',
            params: {'LAYERS': 'nxprovincias', 'TILED': true}
        });

        layer5 = new ol.layer.Tile({
            legendUrl: 'http://localhost:8080/geoserver/WMS_LinearLab/wms?' +
                'SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image%2Fpng&' +
                'TRANSPARENT=true&LAYERS=OSM-WMS&TILED=true&WIDTH=256&' +
                'HEIGHT=256&CRS=EPSG%3A3857&STYLES=&' +
                'BBOX=0%2C0%2C10018754.171394622%2C10018754.171394622',
            source: source5,
            name: 'Provincias',
            visible: false
        });
        /*fin provincias */

        /* carga de la capa cantones */
        source6 = new ol.source.TileWMS({
            url: 'http://localhost:8080/geoserver/WMS_LinearLab/wms',
            params: {'LAYERS': 'nxcantones', 'TILED': true}
        });

        layer6 = new ol.layer.Tile({
            legendUrl: 'http://localhost:8080/geoserver/WMS_LinearLab/wms?' +
                'SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image%2Fpng&' +
                'TRANSPARENT=true&LAYERS=OSM-WMS&TILED=true&WIDTH=256&' +
                'HEIGHT=256&CRS=EPSG%3A3857&STYLES=&' +
                'BBOX=0%2C0%2C10018754.171394622%2C10018754.171394622',
            source: source6,
            name: 'Cantones',
            visible: false
        });
        /* fin cantones*/

        /* carga de la capa parroquias */
        source7 = new ol.source.TileWMS({
            url: 'http://localhost:8080/geoserver/WMS_LinearLab/wms',
            params: {'LAYERS': 'nxparroquias', 'TILED': true}
        });

        layer7 = new ol.layer.Tile({
            legendUrl: 'http://localhost:8080/geoserver/WMS_LinearLab/wms?' +
                'SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image%2Fpng&' +
                'TRANSPARENT=true&LAYERS=OSM-WMS&TILED=true&WIDTH=256&' +
                'HEIGHT=256&CRS=EPSG%3A3857&STYLES=&' +
                'BBOX=0%2C0%2C10018754.171394622%2C10018754.171394622',
            source: source7,
            name: 'Parroquias',
            visible: false
        });
        /* fin parroquias*/

        /* carga de la capa curva de nivel*/
        source8 = new ol.source.TileWMS({
            url: 'http://localhost:8080/geoserver/WMS_LinearLab/wms',
            params: {'LAYERS': 'curva_nivel_l', 'TILED': true}
        });

        layer8 = new ol.layer.Tile({
            legendUrl: 'http://localhost:8080/geoserver/WMS_LinearLab/wms?' +
                'SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image%2Fpng&' +
                'TRANSPARENT=true&LAYERS=OSM-WMS&TILED=true&WIDTH=256&' +
                'HEIGHT=256&CRS=EPSG%3A3857&STYLES=&' +
                'BBOX=0%2C0%2C10018754.171394622%2C10018754.171394622',
            source: source8,
            name: 'curva de nivel',
            visible: false
        });
        /* fin curva de nivel*/

        /* carga de la capa Zona urbana*/
        source9 = new ol.source.TileWMS({
            url: 'http://localhost:8080/geoserver/WMS_LinearLab/wms',
            params: {'LAYERS': 'zona_urbana_a', 'TILED': true}
        });

        layer9 = new ol.layer.Tile({
            legendUrl: 'http://localhost:8080/geoserver/WMS_LinearLab/wms?' +
                'SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image%2Fpng&' +
                'TRANSPARENT=true&LAYERS=OSM-WMS&TILED=true&WIDTH=256&' +
                'HEIGHT=256&CRS=EPSG%3A3857&STYLES=&' +
                'BBOX=0%2C0%2C10018754.171394622%2C10018754.171394622',
            source: source9,
            name: 'Zona urbana',
            visible: false
        });
        /* fin Zona urbana*/

        /* carga de la capa sendero*/
        source10 = new ol.source.TileWMS({
            url: 'http://localhost:8080/geoserver/WMS_LinearLab/wms',
            params: {'LAYERS': 'sendero_l', 'TILED': true}
        });

        layer10 = new ol.layer.Tile({
            legendUrl: 'http://localhost:8080/geoserver/WMS_LinearLab/wms?' +
                'SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image%2Fpng&' +
                'TRANSPARENT=true&LAYERS=OSM-WMS&TILED=true&WIDTH=256&' +
                'HEIGHT=256&CRS=EPSG%3A3857&STYLES=&' +
                'BBOX=0%2C0%2C10018754.171394622%2C10018754.171394622',
            source: source10,
            name: 'Sendero',
            visible: false
        });
        /* fin Sendero*/

        /* carga de la vias*/
        source11 = new ol.source.TileWMS({
            url: 'http://localhost:8080/geoserver/WMS_LinearLab/wms',
            params: {'LAYERS': 'via_l', 'TILED': true}
        });

        layer11 = new ol.layer.Tile({
            legendUrl: 'http://localhost:8080/geoserver/WMS_LinearLab/wms?' +
                'SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image%2Fpng&' +
                'TRANSPARENT=true&LAYERS=OSM-WMS&TILED=true&WIDTH=256&' +
                'HEIGHT=256&CRS=EPSG%3A3857&STYLES=&' +
                'BBOX=0%2C0%2C10018754.171394622%2C10018754.171394622',
            source: source11,
            name: 'Vias',
            visible: false
        });
        /* fin Vias*/

        /* carga del puente*/
        source12 = new ol.source.TileWMS({
            url: 'http://localhost:8080/geoserver/WMS_LinearLab/wms',
            params: {'LAYERS': 'puente_p', 'TILED': true}
        });

        layer12 = new ol.layer.Tile({
            legendUrl: 'http://localhost:8080/geoserver/WMS_LinearLab/wms?' +
                'SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image%2Fpng&' +
                'TRANSPARENT=true&LAYERS=OSM-WMS&TILED=true&WIDTH=256&' +
                'HEIGHT=256&CRS=EPSG%3A3857&STYLES=&' +
                'BBOX=0%2C0%2C10018754.171394622%2C10018754.171394622',
            source: source12,
            name: 'Puentes',
            visible: false
        });
        /* fin Puentes*/

        /* carga del granjas acuaticas*/
        source13 = new ol.source.TileWMS({
            url: 'http://localhost:8080/geoserver/WMS_LinearLab/wms',
            params: {'LAYERS': 'granjas_acuaticas_a', 'TILED': true}
        });

        layer13 = new ol.layer.Tile({
            legendUrl: 'http://localhost:8080/geoserver/WMS_LinearLab/wms?' +
                'SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image%2Fpng&' +
                'TRANSPARENT=true&LAYERS=OSM-WMS&TILED=true&WIDTH=256&' +
                'HEIGHT=256&CRS=EPSG%3A3857&STYLES=&' +
                'BBOX=0%2C0%2C10018754.171394622%2C10018754.171394622',
            source: source13,
            name: 'Granjas acuaticas',
            visible: false
        });
        /* fin granjas acuaticas*/

        /* carga del Lagos y Lagunas*/
        source14 = new ol.source.TileWMS({
            url: 'http://localhost:8080/geoserver/WMS_LinearLab/wms',
            params: {'LAYERS': 'lago_laguna_a', 'TILED': true}
        });

        layer14 = new ol.layer.Tile({
            legendUrl: 'http://localhost:8080/geoserver/WMS_LinearLab/wms?' +
                'SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image%2Fpng&' +
                'TRANSPARENT=true&LAYERS=OSM-WMS&TILED=true&WIDTH=256&' +
                'HEIGHT=256&CRS=EPSG%3A3857&STYLES=&' +
                'BBOX=0%2C0%2C10018754.171394622%2C10018754.171394622',
            source: source14,
            name: 'Lagos y Lagunas ',
            visible: false
        });
        /* fin Lagos y Lagunas*/

        /* carga del Rios*/
        source15 = new ol.source.TileWMS({
            url: 'http://localhost:8080/geoserver/WMS_LinearLab/wms',
            params: {'LAYERS': 'rio_l', 'TILED': true}
        });

        layer15 = new ol.layer.Tile({
            legendUrl: 'http://localhost:8080/geoserver/WMS_LinearLab/wms?' +
                'SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image%2Fpng&' +
                'TRANSPARENT=true&LAYERS=OSM-WMS&TILED=true&WIDTH=256&' +
                'HEIGHT=256&CRS=EPSG%3A3857&STYLES=&' +
                'BBOX=0%2C0%2C10018754.171394622%2C10018754.171394622',
            source: source15,
            name: 'Rios ',
            visible: false
        });
        /* fin Rios*/

        /* carga del Rio Atacames*/
        source16 = new ol.source.TileWMS({
            url: 'http://localhost:8080/geoserver/WMS_LinearLab/wms',
            params: {'LAYERS': 'Río Atacames', 'TILED': true}
        });

        layer16 = new ol.layer.Tile({
            legendUrl: 'http://localhost:8080/geoserver/WMS_LinearLab/wms?' +
                'SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image%2Fpng&' +
                'TRANSPARENT=true&LAYERS=OSM-WMS&TILED=true&WIDTH=256&' +
                'HEIGHT=256&CRS=EPSG%3A3857&STYLES=&' +
                'BBOX=0%2C0%2C10018754.171394622%2C10018754.171394622',
            source: source16,
            name: 'Rio Atacames',
            visible: false
        });
        /* fin Rios Atacames*/

        /* carga del Rio Sua*/
        source17 = new ol.source.TileWMS({
            url: 'http://localhost:8080/geoserver/WMS_LinearLab/wms',
            params: {'LAYERS': 'Río Súa', 'TILED': true}
        });

        layer17 = new ol.layer.Tile({
            legendUrl: 'http://localhost:8080/geoserver/WMS_LinearLab/wms?' +
                'SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image%2Fpng&' +
                'TRANSPARENT=true&LAYERS=OSM-WMS&TILED=true&WIDTH=256&' +
                'HEIGHT=256&CRS=EPSG%3A3857&STYLES=&' +
                'BBOX=0%2C0%2C10018754.171394622%2C10018754.171394622',
            source: source17,
            name: 'Rio Sua',
            visible: false
        });
        /* fin Rios Sua*/

        /* carga Linea Costera*/
        source18 = new ol.source.TileWMS({
            url: 'http://localhost:8080/geoserver/WMS_LinearLab/wms',
            params: {'LAYERS': 'linea_costa_l', 'TILED': true}
        });

        layer18 = new ol.layer.Tile({
            legendUrl: 'http://localhost:8080/geoserver/WMS_LinearLab/wms?' +
                'SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image%2Fpng&' +
                'TRANSPARENT=true&LAYERS=OSM-WMS&TILED=true&WIDTH=256&' +
                'HEIGHT=256&CRS=EPSG%3A3857&STYLES=&' +
                'BBOX=0%2C0%2C10018754.171394622%2C10018754.171394622',
            source: source18,
            name: 'Linea Costera',
            visible: false
        });
        /* fin Linea Costera*/

        /* carga Nombres de Area*/
        source19 = new ol.source.TileWMS({
            url: 'http://localhost:8080/geoserver/WMS_LinearLab/wms',
            params: {'LAYERS': 'nombres_areas_p', 'TILED': true}
        });

        layer19 = new ol.layer.Tile({
            legendUrl: 'http://localhost:8080/geoserver/WMS_LinearLab/wms?' +
                'SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image%2Fpng&' +
                'TRANSPARENT=true&LAYERS=OSM-WMS&TILED=true&WIDTH=256&' +
                'HEIGHT=256&CRS=EPSG%3A3857&STYLES=&' +
                'BBOX=0%2C0%2C10018754.171394622%2C10018754.171394622',
            source: source19,
            name: 'Nombres de Area',
            visible: false
        });
        /* fin Nombres de Area*/

        /* carga Poblados*/
        source20 = new ol.source.TileWMS({
            url: 'http://localhost:8080/geoserver/WMS_LinearLab/wms',
            params: {'LAYERS': 'poblado_p', 'TILED': true}
        });

        layer20 = new ol.layer.Tile({
            legendUrl: 'http://localhost:8080/geoserver/WMS_LinearLab/wms?' +
                'SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image%2Fpng&' +
                'TRANSPARENT=true&LAYERS=OSM-WMS&TILED=true&WIDTH=256&' +
                'HEIGHT=256&CRS=EPSG%3A3857&STYLES=&' +
                'BBOX=0%2C0%2C10018754.171394622%2C10018754.171394622',
            source: source20,
            name: 'Poblados',
            visible: false
        });
        /* fin Poblados*/

        /* carga Estadio*/
        source21 = new ol.source.TileWMS({
            url: 'http://localhost:8080/geoserver/WMS_LinearLab/wms',
            params: {'LAYERS': 'estadio_a', 'TILED': true}
        });

        layer21 = new ol.layer.Tile({
            legendUrl: 'http://localhost:8080/geoserver/WMS_LinearLab/wms?' +
                'SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image%2Fpng&' +
                'TRANSPARENT=true&LAYERS=OSM-WMS&TILED=true&WIDTH=256&' +
                'HEIGHT=256&CRS=EPSG%3A3857&STYLES=&' +
                'BBOX=0%2C0%2C10018754.171394622%2C10018754.171394622',
            source: source21,
            name: 'Estadio',
            visible: false
        });
        /* fin Estadio*/

        /* carga Edificios*/
        source22 = new ol.source.TileWMS({
            url: 'http://localhost:8080/geoserver/WMS_LinearLab/wms',
            params: {'LAYERS': 'edificio_p', 'TILED': true}
        });

        layer22 = new ol.layer.Tile({
            legendUrl: 'http://localhost:8080/geoserver/WMS_LinearLab/wms?' +
                'SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image%2Fpng&' +
                'TRANSPARENT=true&LAYERS=OSM-WMS&TILED=true&WIDTH=256&' +
                'HEIGHT=256&CRS=EPSG%3A3857&STYLES=&' +
                'BBOX=0%2C0%2C10018754.171394622%2C10018754.171394622',
            source: source22,
            name: 'Edificios',
            visible: false
        });
        /* fin Edificios*/

        /* carga Casas*/
        source23 = new ol.source.TileWMS({
            url: 'http://localhost:8080/geoserver/WMS_LinearLab/wms',
            params: {'LAYERS': 'casa_p', 'TILED': true}
        });

        layer23 = new ol.layer.Tile({
            legendUrl: 'http://localhost:8080/geoserver/WMS_LinearLab/wms?' +
                'SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image%2Fpng&' +
                'TRANSPARENT=true&LAYERS=OSM-WMS&TILED=true&WIDTH=256&' +
                'HEIGHT=256&CRS=EPSG%3A3857&STYLES=&' +
                'BBOX=0%2C0%2C10018754.171394622%2C10018754.171394622',
            source: source23,
            name: 'Casas',
            visible: false
        });
        /* fin Casas*/

        /* carga Canchas*/
        source24 = new ol.source.TileWMS({
            url: 'http://localhost:8080/geoserver/WMS_LinearLab/wms',
            params: {'LAYERS': 'cancha_a', 'TILED': true}
        });

        layer24 = new ol.layer.Tile({
            legendUrl: 'http://localhost:8080/geoserver/WMS_LinearLab/wms?' +
                'SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image%2Fpng&' +
                'TRANSPARENT=true&LAYERS=OSM-WMS&TILED=true&WIDTH=256&' +
                'HEIGHT=256&CRS=EPSG%3A3857&STYLES=&' +
                'BBOX=0%2C0%2C10018754.171394622%2C10018754.171394622',
            source: source24,
            name: 'Canchas',
            visible: false
        });
        /* fin Canchas*/

        /* carga Malecon*/
        source25 = new ol.source.TileWMS({
            url: 'http://localhost:8080/geoserver/WMS_LinearLab/wms',
            params: {'LAYERS': 'malecon_l', 'TILED': true}
        });

        layer25 = new ol.layer.Tile({
            legendUrl: 'http://localhost:8080/geoserver/WMS_LinearLab/wms?' +
                'SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image%2Fpng&' +
                'TRANSPARENT=true&LAYERS=OSM-WMS&TILED=true&WIDTH=256&' +
                'HEIGHT=256&CRS=EPSG%3A3857&STYLES=&' +
                'BBOX=0%2C0%2C10018754.171394622%2C10018754.171394622',
            source: source25,
            name: 'Malecon',
            visible: false
        });
        /* fin Malecon*/

        /* carga Faro*/
        source26 = new ol.source.TileWMS({
            url: 'http://localhost:8080/geoserver/WMS_LinearLab/wms',
            params: {'LAYERS': 'faro_p', 'TILED': true}
        });

        layer26 = new ol.layer.Tile({
            legendUrl: 'http://localhost:8080/geoserver/WMS_LinearLab/wms?' +
                'SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image%2Fpng&' +
                'TRANSPARENT=true&LAYERS=OSM-WMS&TILED=true&WIDTH=256&' +
                'HEIGHT=256&CRS=EPSG%3A3857&STYLES=&' +
                'BBOX=0%2C0%2C10018754.171394622%2C10018754.171394622',
            source: source26,
            name: 'Faro',
            visible: false
        });
        /* fin Faro*/



        


        group = new ol.layer.Group({
            layers: [layer1, layer2],
            name: 'Componentes mapa base'
        });

        groupR = new ol.layer.Group({
            layers: [layer5,layer6,layer7,layer8],
            name: 'Componentes regional'
        });

        groupT = new ol.layer.Group({
            layers: [layer10, layer11,layer12,layer18,layer19],
            name: 'Componentes terrestres'
        });

        groupP = new ol.layer.Group({
            layers: [layer9,layer20],
            name: 'Componentes poblacional'
        });

        groupA = new ol.layer.Group({
            layers: [layer13,layer14,layer15,layer16,layer17],
            name: 'Componentes Acuiferos'
        });

        groupE = new ol.layer.Group({
            layers: [layer21,layer22,layer23,layer24,layer25,layer26],
            name: 'Componentes estructural'
        });

        olMap = new ol.Map({
            layers: [group,groupR,groupT,groupP,groupA,groupE],
            view: new ol.View({
                center: [-8886888, 98000],
                zoom: 14
            })
        });

        mapComponent = Ext.create('GeoExt.component.Map', {
            map: olMap
        });

        mapPanel = Ext.create('Ext.panel.Panel', {
            region: 'center',
            layout: 'fit',
            border: false,
            items: [mapComponent]
        });

        treeStore = Ext.create('GeoExt.data.store.LayersTree', {
            layerGroup: olMap.getLayerGroup()
        });
/*
        treePanel = Ext.create('Ext.tree.Panel', {
            title: 'Legends in tree panel',
            store: treeStore,
            border: false,
            rootVisible: false,
            hideHeaders: true,
            lines: false,
            flex: 1,
            columns: {
                header: false,
                items: [
                    {
                        xtype: 'treecolumn',
                        dataIndex: 'text',
                        flex: 1,
                        plugins: [
                            {
                                ptype: 'basic_tree_column_legend'
                            }
                        ]
                    }
                ]
            }
        });
*/
        treeStore2 = Ext.create('GeoExt.data.store.LayersTree', {
            layerGroup: olMap.getLayerGroup()
        });

        treePanel2 = Ext.create('Ext.tree.Panel', {
            title: 'treePanel',
            store: treeStore2,
            rootVisible: false,
            border: false,
            flex: 1,
            hideHeaders: true,
            lines: false,
            features: [{
                ftype: 'rowbody',
                setupRowData: function(rec, rowIndex, rowValues) {
                    var headerCt = this.view.headerCt;
                    var colspan = headerCt.getColumnCount();
                    var isChecked = rec.get('checked');
                    var layer = rec.data;
                    var GrpClass = ol.layer.Group;
                    var hasLegend = isChecked && !(layer instanceof GrpClass);
                    var legendUrl = hasLegend && layer.get('legendUrl');
                    var legHtml = '';

                    if (!legendUrl) {
                        legendUrl = 'https://geoext.github.io/geoext2/' +
                            'website-resources/img/GeoExt-logo.png';
                    }
                    legHtml = '<img class="legend" src="' + legendUrl +
                        '" height="32" />';

                    // Usually you would style the my-body-class in CSS file
                    Ext.apply(rowValues, {
                        rowBody: hasLegend ? legHtml : '',
                        rowBodyCls: 'my-body-class',
                        rowBodyColspan: colspan
                    });
                }
            }]
        });

        var description = Ext.create('Ext.panel.Panel', {
            contentEl: 'description',
            title: 'Description',
            height: 200,
            border: false,
            bodyPadding: 5
        });

        Ext.create('Ext.Viewport', {
            layout: 'border',
            items: [
                mapPanel,
                {
                    xtype: 'panel',
                    region: 'west',
                    width: 400,
                    layout: {
                        type: 'vbox',
                        align: 'stretch'
                    },
                    items: [
                        treePanel,
                        description,
                        treePanel2
                    ]
                }
            ]
        });
    }
});
