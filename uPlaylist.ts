
// import "./foo_spider_monkey_panel"
const COLOR_WINDOW = 5;
const COLOR_HIGHLIGHT = 13;
const COLOR_BTNFACE = 15;
const COLOR_BTNTEXT = 18;


// Used in window.GetColorCUI()
const ColorTypeCUI = {
	text: 0,
	selection_text: 1,
	inactive_selection_text: 2,
	background: 3,
	selection_background: 4,
	inactive_selection_background: 5,
	active_item_frame: 6
};
// Used in window.GetFontCUI()
const FontTypeCUI = {
	items: 0,
	labels: 1
};
// Used in window.GetColorDUI()
const ColorTypeDUI = {
	text: 0,
	background: 1,
	highlight: 2,
	selection: 3
};
// Used in window.GetFontDUI()
const FontTypeDUI = {
	defaults: 0,
	tabs: 1,
	lists: 2,
	playlists: 3,
	statusbar: 4,
	console: 5
};

// Used everywhere!
function RGB(r : number, g : number, b: number) {
	return (0xff000000 | (r << 16) | (g << 8) | (b));
};
function RGBA(r : number, g : number, b: number, a:number) {
	return ((a << 24) | (r << 16) | (g << 8) | (b));
};

// ^ COMMON API ^

const ui_type = window.InstanceType;

const Colors = {
    window : utils.GetSysColour(COLOR_WINDOW),
	highlight : utils.GetSysColour(COLOR_HIGHLIGHT),
	btn_bg : utils.GetSysColour(COLOR_BTNFACE),
	btn_txt : utils.GetSysColour(COLOR_BTNTEXT),

    //TODO: add custom ? getproperty : 

    txt : ui_type ? window.GetColourDUI(ColorTypeDUI.text) : window.GetColourCUI(ColorTypeCUI.text),
    selected_txt : ui_type ? window.GetColourDUI(ColorTypeDUI.selection) : window.GetColourCUI(ColorTypeCUI.selection_text),
    bg : ui_type ? window.GetColourDUI(ColorTypeDUI.background) : window.GetColourCUI(ColorTypeCUI.background),
    selected_bg : ui_type ? window.GetColourDUI(ColorTypeDUI.selection) : window.GetColourCUI(ColorTypeCUI.selection_background),
    highligh : ui_type ? window.GetColourDUI(ColorTypeDUI.selection) : window.GetColourCUI(ColorTypeCUI.selection_background),
}



class FileInfo{
    info: { [key: string] : string | Array<string>} = {}
    meta: { [key: string] : string | Array<string>}  = {}
    handle? : FbMetadbHandle
    constructor(file_handle : FbMetadbHandle)
    {

        const file_info = file_handle.GetFileInfo()
        
        if (file_info == null) return;

        for (let i = 0; i < file_info.InfoCount; i++)
        {
            this.info[file_info.InfoName(i)] = file_info.InfoValue(i)
        }

        for (let i = 0; i < file_info.MetaCount; i++)
        {
            if (file_info.MetaValueCount(i) > 1)
            {
                let meta_value = []
                for (let j = 0; j < file_info.MetaValueCount(i); j++)
                {
                    meta_value.push(file_info.MetaValue(i,j))
                }
                this.meta[file_info.MetaName(i)] = meta_value
            }
            else
            {
                this.meta[file_info.MetaName(i)] = file_info.MetaValue(i,0)
            }
        }
        this.handle = file_handle
    }

}
class Window
{
    x = 0;
    y = 0;
    width = 0;
    height = 0;
    children:Array<Window> = []
    parent?: Window
    name = "Window"
    constructor(x = 0,y = 0, width = 0,height = 0)
    {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    draw(graphic : GdiGraphics)
    {
        for (const i of this.children)
        {
            i.draw(graphic);
        }
    }
    add(window: Window)
    {
        this.children.push(window)
        window.parent = this
    }
}
class Background extends Window
{
    color = Colors.bg
    draw(graphic : GdiGraphics)
    {
        graphic.FillSolidRect(0, 0, this.width, this.height, this.color);
    }
}
class Playlist extends Window
{
    list: Array<FileInfo> = []
    currentPlaylist: number = 0
    constructor(x = 0, y = 0, width = 0, height = 0)
    {
        super(x,y,width,height)
        this.currentPlaylist = plman.ActivePlaylist;
        this.refresh();
    }
    refresh()
    {
        this.list = []
        const playlist_items = plman.GetPlaylistItems(this.currentPlaylist)
        for (const i of playlist_items)
        {
            this.list.push(new FileInfo(i));
        }
    }
    [Symbol.iterator] (){
        return this.list[Symbol.iterator]()
    }
}

for (const i of new Playlist())
{
    console.log(i)
}
class PlaylistItem
{

}
class PlaylistWindow extends Window
{
    playlist?: Playlist
    constructor()
    {
        super(0, 0, window.Width, window.Height);
        this.add(new Background(this.x, this.y, this.width, this.height))
        this.playlist = new Playlist(this.x, this.y, this.height, this.width)
        this.add(this.playlist)
    }

}
const mainWindow = new PlaylistWindow();

function on_paint(graphic : GdiGraphics) {
    mainWindow.draw(graphic);
}

function on_size() {
	
}
