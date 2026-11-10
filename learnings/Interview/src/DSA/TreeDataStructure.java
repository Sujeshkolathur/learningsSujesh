package DSA;

public class TreeDataStructure {
	private Node root;
	
	public TreeDataStructure(Node root) {
		this.root=root;
	}
	
	public void inOrderTraversal(Node root) {
		if(root!=null) {
			inOrderTraversal(root.leftchild);
			System.out.println(root.data);
			inOrderTraversal(root.rightChild);
		}
	}
	public void postOrderTraversal(Node root) {
		if(root!=null) {
			postOrderTraversal(root.leftchild);
			postOrderTraversal(root.rightChild);
			System.out.println(root.data);

		}
	}
	public void preOrderTraversal(Node root) {
		if(root!=null) {
			System.out.println(root.data);
			preOrderTraversal(root.leftchild);
			preOrderTraversal(root.rightChild);

		}
	}
	
}
