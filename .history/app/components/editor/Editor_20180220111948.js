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
            depthMap: new Map(),
            childMap: new Map()
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
        this.handleReturn = this.handleReturn.bind(this);
        this.saveDepthMap = this.saveDepthMap.bind(this);
        this.saveChildMap = this.saveChildMap.bind(this);
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

        if (KeyBindingUtil.hasCommandModifier(event) && event.keyCode === 83) {
            return 'saveChart';
        }else if(KeyBindingUtil.hasCommandModifier(event) && event.keyCode === 13){
            return 'printMap';
        }else if(KeyBindingUtil.hasCommandModifier(event) && event.keyCode === 80){
            return 'printEditorStateMap';
        }

        return getDefaultKeyBinding(event);
    }

    handleKeyCommand(command){
        let editorState = this.state.editorState;
       
        if (command === 'saveChart') {
            return 'handled';
        }else if(command === 'printEditorStateMap'){
            let map = this.state.depthMap;
           
                                        
            console.log(currentText.getText(), currentText.getDepth());
            
            return 'handled';
        }
        return 'not-handled';
    }

    saveDepthMap(){
        let blockMap = this.state.editorState
                            .getCurrentContent()
                            .getBlockMap()

        let startKey = this.state.editorState
                            .getSelection()
                            .getStartKey()

        let currentText = this.state.editorState
                            .getCurrentContent()
                            .getBlockForKey(startKey)
        
        
        let depthMap = new Map();
        let childMap = new Map();
        
        blockMap.forEach(k => {
            let depth = k.getDepth();
            let text = k.getText();
            if(text.replace(/^\s+|\s+$/g, '') !== undefined || text === ''){
                if(!depthMap.has(depth)){
                    depthMap = depthMap.set(depth, [text]);
                    childMap = this.saveChildMap(childMap, depthMap, depth, text);
                    this.setState({
                        depthMap,
                        childMap
                    }, () => {
                        console.log(this.state.depthMap, this.state.childMap);
                    });
                }else if(depthMap.has(depth)){
                        let array =  depthMap.get(depth);
                        depthMap = depthMap.set(depth, array.concat([text]));
                        childMap = this.saveChildMap(childMap, depthMap, depth, text);
                        this.setState({
                            depthMap,
                            childMap
                        }, () => {
                            console.log(this.state.depthMap, this.state.childMap);
                        });
                }
            }
        });
    }

    saveChildMap(childMap, depthMap, depth, text){
        if(depthMap.has(depth-1)){ 
            let newText = depthMap.get(depth - 1)[depthMap.get(depth - 1).length - 1];
            if(depth < 3){
                childMap = childMap.set(newText, childMap.get(newText).concat([text])).set(text, []);
            }else{
                childMap = childMap.set(newText, childMap.get(newText).concat([text]));
            }
        }else{
            childMap = childMap.set(text, []);
        }
        return childMap
    }

    handleReturn(e){
        return this.saveDepthMap();
    }

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
                    handleReturn={this.handleReturn}
                />
            </div>
        );
    }
}

export default Editor2;
