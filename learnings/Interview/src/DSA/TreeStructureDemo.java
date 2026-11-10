package DSA;

public class TreeStructureDemo {
	public static void main(String[] args) {
		Node node= new Node(23);
		Node leftNode= new Node(10);
		Node rightNode= new Node(100);
		node.leftchild=leftNode;
		node.rightChild=rightNode;

		TreeDataStructure treeDataStructure = new TreeDataStructure(node);
		treeDataStructure.inOrderTraversal(node);
		treeDataStructure.postOrderTraversal(node);
		treeDataStructure.preOrderTraversal(node);
	}

}
