import React, { Component } from 'react';
import { Editor, EditorState, RichUtils, DefaultDraftBlockRenderMap } from 'draft-js';
import { Divider } from 'semantic-ui-react';
import { Map } from 'immutable';
import {getDefaultKeyBinding, KeyBindingUtil} from 'draft-js';
import utilFn from "./utilFunctions";
const {hasCommandModifier} = KeyBindingUtil;


class Editor2 extends Component {

    constructor(){
        super();

        this.state = {
            editorState: EditorState.createEmpty(),
            editorPadding: 'very',
            recordId: 0,
            depthMap: Map(),
            childMap: Map()
        };

        const TODO_TYPE = 'todo';
        this.blockRenderMap = Map({
            [TODO_TYPE]: {
                element: 'div',
            }
        }).merge(DefaultDraftBlockRenderMap);

        this.onChange = this.onChange.bind(this);
        this.getEditorState = () => this.state.editorState;
        this.handleKeyCommand = this.handleKeyCommand.bind(this);
        this.keyBindingFn = this.keyBindingFn.bind(this);
        this.handleBeforeInput = this.handleBeforeInput.bind(this);
        this.onTab = (e) => this._onTab(e);
        // this.handleReturn = this.handleReturn.bind(this);
        this.addToDepthMap = this.addToDepthMap.bind(this);
        this.addToChildMap = this.addToChildMap.bind(this);
    }

    _onTab(e) {
        const maxDepth = 2;
        this.onChange(RichUtils.onTab(e, this.state.editorState, maxDepth));
    }

    /* to maintain the focus of the editor while starting */
    componentDidMount(){
        this.refs.editor.focus();
    }

    onChange(editorState){
        this.setState({
            editorState
        });
    }

    keyBindingFn(event){

        if (KeyBindingUtil.hasCommandModifier(event) && event.keyCode === 80) {
            return 'saveChart';
        }else if(KeyBindingUtil.hasCommandModifier(event) && event.keyCode === 13){
            return 'printMap';
        }

        return getDefaultKeyBinding(event);
    }

    addToDepthMap(){
        let newDepthMap = this.state.depthMap;
        let editorState = this.state.editorState;

        editorState.getCurrentContent().getBlockMap().forEach((k,v) => {
            let depth = k.getDepth();
            let text = k.getText();
           
            if(newDepthMap.has(depth)){
                let array = newDepthMap.get(depth).concat([text]);
                this.setState({
                    depthMap: newDepthMap.set(depth, array)
                }, () => {
                    this.addToChildMap(depth, text)
                });
            }else{
                this.setState({
                    depthMap: newDepthMap.set(depth, [text])
                }, () => {
                    this.addToChildMap(depth, text)
                });
            }
        });
    }

    addToChildMap(depth, text){
        let newChildMap = this.state.childMap;
        let depthMap = this.state.depthMap;
       
        if(depthMap.has(depth-1)){
            let tempArray = depthMap.get(depth-1)
            let key = tempArray[tempArray.length-1]
            let array = newChildMap.get(key).concat([text]);
            this.setState({
                childMap:  newChildMap.set(key, array).set(text, [])
            });
        }else{
            let array = [];
            this.setState({
                childMap: newChildMap.set(text, array)
            });
        }
    }

    handleKeyCommand(command){
        let editorState = this.state.editorState;
        if (command === 'saveChart') {
            this.addToDepthMap();
            this.state.editorState.getCurrentContent().getBlockMap((k,v) => {
                console.log(k.getDepth(), k.getText());
            });
            return 'handled';
        }else if(command === 'printMap'){
            console.log(this.state.depthMap);
            console.log(this.state.childMap);
            return 'handled';
        }
        return 'not-handled';
    }

    // handleReturn(e){
    //     return null;
    // }

    handleBeforeInput(str){
        if(str !== '.'){
            return false;
        }

        const { editorState } = this.state;
        const selection = editorState.getSelection();

        const currentBlock = editorState.getCurrentContent()
            .getBlockForKey(selection.getStartKey());

        const blockType = currentBlock.getType();
        const blockLength = currentBlock.getLength();

        if(blockLength === 1 && currentBlock.getText() === '1'){
            this.onChange((utilFn.resetBlockType(editorState, 'ordered-list-item')));
            return true;
        }
        
        return false;
    }

    render() {
        return (
            <div className='svgDiv' id='style-4' onClick={this.focus}>
                <h2>Start with your notes here..</h2>
                <Divider />
                <Editor
                    className='editor'
                    editorState={this.state.editorState}
                    handleKeyCommand={this.handleKeyCommand}
                    onChange={this.onChange}
                    ref='editor'
                    keyBindingFn={this.keyBindingFn}
                    handleBeforeInput={this.handleBeforeInput}
                    onTab={this.onTab}
                    // handleReturn={this.handleReturn}
                />
            </div>
        );
    }
}

export default Editor2;
