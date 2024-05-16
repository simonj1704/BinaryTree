window.addEventListener("load", start);

function start() {
  console.log("Ready.");
  


  /* tree.insert(50);
  tree.insert(30);
  tree.insert(70);
  tree.insert(20);
  tree.insert(40);
  tree.insert(10);
  tree.insert(25);
  tree.insert(45);
  tree.insert(60);
  tree.insert(80); */
  
  addStrings();
}


/* A temporary function to build a tree manually.
 * 
 * To be replaced by calls to ```tree.addItem( )``` ASAP
 */
function buildTreeManually(rootNode) {
  
  rootNode.left = tree.createChild(30, rootNode);
  rootNode.right = tree.createChild(70, rootNode);

  // create the left subtree
  let ltree = rootNode.left;
  ltree.left = tree.createChild(20, ltree);
  ltree.right = tree.createChild(40, ltree);

  // and the two subtrees below the left subtree
  let ltree1 = ltree.left;
  ltree1.left = tree.createChild(10, ltree1);
  ltree1.right = tree.createChild(25, ltree1);
  
  let ltree2 = ltree.right;
  // ltree2 does not have a left-child yet
  ltree2.right = tree.createChild(45, ltree);
  
  // now create the right subtree
  let rtree = rootNode.right;
  rtree.left = tree.createChild(60, rtree);
  rtree.right = tree.createChild(80, rtree);
}

class BinaryTree {
  constructor( compare ) {
    this.root = null;
    this.size = 0;
    this.compareFunction = compare || ((a, b) => a - b);
  }

  insert(item){
    if(!this.root){
      this.createRootNode(item);
    } else {
      this.addItem(item);
    }
  }

  createRootNode(item) {
    this.root = this.createChild(item);
    this.size++;
    return this.root;
  }

  createChild(item, parent = null) {
    return {
      parent: parent,
      left: null,
      right: null,
      item: item,
      height: 0
    };
  }

  replaceChild(parent, oldChild, newChild) {
    if (parent.left === oldChild) {
      parent.left = newChild;
    } else if (parent.right === oldChild) {
      parent.right = newChild;
    }
  }


  /* Give root to this method and it will print the traversal order */ 
  traverse(node) {
    if (!node){
      return;
    }
    this.traverse(node.left);
    console.log(node.item);
    this.traverse(node.right);
  }

  first(){
    let node = this.root;
    while(node.left){
      node = node.left;
    }
    return node.item;
  }

  last(){
    let node = this.root;
    while(node.right){
      node = node.right;
    }
    return node.item;
  }

  contains(itemValue){
    let node = this.root;
    while(node){
      if(node.item === itemValue){
        return true;
      } else if(itemValue < node.item){
        node = node.left;
      } else {
        node = node.right;
      }
    }
    return false;
  }

  getSuccesor(node){
    node = node.right;
    while(node.left){
      node = node.left;
    }
    return node;
  }

  getPredecessor(node){
    node = node.left;
    while(node.right){
      node = node.right;
    }
    return node;
  }

  getNext(itemValue){
    let node = this.root;
    let next = null;
    while(node){
      if(itemValue < node.item){
        next = node;
        node = node.left;
      } else {
        node = node.right;
      }
    }
    return next.item;

  }

  getPrevious(itemValue){
    let node = this.root;
    let previous = null;
    while(node){
      if(itemValue > node.item){
        previous = node;
        node = node.right;
      } else {
        node = node.left;
      }
    }
    return previous.item;
  }

  getNode(itemValue){
    let node = this.root;
    while(node){
      if(node.item === itemValue){
        return node;
      } else if(itemValue < node.item){
        node = node.left;
      } else {
        node = node.right;
      }
    }
    return null;
  }

  remove(itemValue){
    let node = this.getNode(itemValue);
    if(!node){
      console.log("Item not found")
      return;
    }

    if(node.left && node.right){
      let succesor = this.getSuccesor(node);
      node.item = succesor.item;
      node = succesor;
    }


    let child = node.left || node.right;
    if(child){
      child.parent = node.parent;
    }

    

    if(node.parent){
      if(node.parent.left === node){
        node.parent.left = child;
      } else {
        node.parent.right = child;
      }
      this.maintain(node.parent);
    } else {
      this.root = child;
    }
    this.size--;
  }

  getSize(){
    return this.size;
  }

  updateHeight(node){
    //update the height of this node
    let leftHeight = node.left ? node.left.height : -1;
    let rightHeight = node.right ? node.right.height : -1;

    node.height = Math.max(leftHeight, rightHeight) + 1;
  }

  skew(node){
    const leftHeight = node.left ? node.left.height : -1;
    const rightHeight = node.right ? node.right.height : -1;
    return leftHeight - rightHeight;
  }

  rotateRight(node){
    let left = node.left;
    if(left.right){
      left.right.parent = node;
    }
    
    node.left = left.right;
    left.right = node;
    
    

    this.updateHeight(node);
    this.updateHeight(left);

    if(node.parent){
      this.replaceChild(node.parent, node, left);
    } else {
      this.root = left;
    }
    left.parent = node.parent;
    node.parent = left;
  }

  rotateLeft(node){
    let right = node.right;
    if(right.left){
      right.left.parent = node;
    }
    node.right = right.left;
    right.left = node;
    

    this.updateHeight(node);
    this.updateHeight(right);

    if(node.parent){
      this.replaceChild(node.parent, node, right);
    } else {
      this.root = right;
    }
    right.parent = node.parent;
    node.parent = right;
  }

  rebalance(node){
    if(this.skew(node) === 2){
      if(this.skew(node.left) === -1){
        this.rotateLeft(node.left);
      }
      this.rotateRight(node);
    } else if(this.skew(node) === -2){
      if(this.skew(node.right) === 1){
        this.rotateRight(node.right);
      }
      this.rotateLeft(node);
    }
  }

  maintain(node){
    this.rebalance(node);

    this.updateHeight(node);

    if(node.parent){
      this.maintain(node.parent);
    }
  }

  addItem(itemValue){
    let node = this.root;
    while(node){
      if(this.compareFunction(itemValue, node.item) < 0){
        if(node.left){
          node = node.left;
        } else {
          node.left = this.createChild(itemValue, node);
          this.maintain(node);
          break;
        }
      } else {
        if(node.right){
          node = node.right;
        } else {
          node.right = this.createChild(itemValue, node);
          this.maintain(node);
          break;
        }
      }
    }
    this.size++;
  }

  print() {
    // Print the tree in a nice way - by creating a (jagged) 2D array of the tree
    // each level (starting from root) is an array in the array that doubles in size from the previous level

    // breaks if the tree is too deep - but that's a problem for another day
     
    // Use DFS to fill array with values
    const treeArray = [];
    let height = 0; // and while we're at it, calculate the height of the tree
    buildTreeArray(this.root, 0, 0);

    // Does a Depth-First-Scan of the Tree,
    // keeping track of the current depth (how far down from the top)
    // and the current indent (how far right from the (possible) left-most node at this depth)
    // stores the node values in a 2D array
    function buildTreeArray(node, depth, indent) {
      if (!node) {
        return;
      }
      height = Math.max(height, depth);
      // insert this node value in the 2D array
      if(!treeArray[depth]) treeArray[depth] = [];
      treeArray[depth][indent] = node.item;
      // visit its children - remember to double indent
      buildTreeArray(node.left, depth + 1, indent * 2);
      buildTreeArray(node.right, depth + 1, indent * 2 + 1);
    }

    // Apparently I'm not smart enough to calculate these, so here's a pre-calculated list
    const indentations = [1, 2, 5, 11, 23, 46, 93];

    let treeString = " ";
    // Display array - one level at a time
    for (let depth = 0; depth < treeArray.length; depth++) {
      const values = treeArray[depth];

      // Calculate indent for this depth (or find it in the pre-calculated table)
      let currentHeight = height - depth; // currentHeight is the distance from the bottom of the tree
      let indent = indentations[currentHeight];

      // Only display tree structure if we are not at the top
      if (depth > 0) {
        // Loop through half the values - and show a subtree with left and right
        for (let i = 0; i < values.length / 2; i++) {
          treeString += " ".repeat(indent);
          // Only show sub-tree if there are some values below
          if (values[i * 2] != undefined || values[i * 2 + 1] != undefined) {
            treeString += "┌";
            treeString += "─".repeat(indent > 1 ? indent : 0);
            treeString += "┴";
            treeString += "─".repeat(indent > 1 ? indent : 0);
            treeString += "┐";
          } else {
            treeString += "   " + "  ".repeat(indent > 1 ? indent : 0);
          }
          treeString += " ".repeat(indent);
          // add a single space before the next "block"
          treeString += " ";
        }
        // and finalize the current line
        treeString += "\n";
      }

      // Indent numbers one less than their "tree drawings"
      // Unless it is the first one, then it is two (or maybe three) less ... mystic math!
      if (depth == 0) {
        treeString += " ".repeat(indent - 2);
      } else {
        treeString += " ".repeat(indent - 1);
      }

      // display values
      for (let i = 0; i < values.length; i++) {
        // if both children are undefined, don't show any of then
        // if only one child is, show it as underscores _
        const showUndefined = !values[i - (i % 2)] && !values[i - (i % 2) + 1] ? " " : "_";
        // if depth is lowest (height-1) - pad values to two characters
        if (depth == height)  {
          treeString += String(values[i] ?? showUndefined.repeat(2)).padStart(2, " ");
          // and add a single space
          treeString += " ";
        } else {
          // otherwise center values in block of three
          treeString += String(values[i] ?? showUndefined.repeat(3)).padEnd(2, " ").padStart(3, " ");

          // and add twice the indentation of spaces + 1 in the middle
          treeString += " ".repeat(indent - 1);
          treeString += " ";
          treeString += " ".repeat(indent - 1);
        }
      }

      // finalize the value-line
      treeString += "\n";
    }

    console.log(treeString);
  }
}

// at the very last - so that everything is ready
//const tree = new BinaryTree();

// version of binary tree that uses a compare function for strings
const tree = new BinaryTree((a, b) => a.localeCompare(b));

function addStrings(){
  tree.insert("Hello");
  tree.insert("World");
  tree.insert("How");
  tree.insert("Are");
  tree.insert("You");
  tree.insert("Today");
  tree.insert("I");
  tree.insert("Hope");
  tree.insert("You");
  tree.insert("Are");
  tree.insert("Fine");
  tree.insert("Today");
  tree.insert("And");
  tree.insert("Every");
  tree.insert("Day");
  tree.insert("Of");
  tree.insert("Your");
  tree.insert("Life");
}