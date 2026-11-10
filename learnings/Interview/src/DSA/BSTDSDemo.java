package DSA;

public class BSTDSDemo {

	public static void main(String[] args) {
		BSTDS root= new BSTDS(23);
		BSTDS leftNode= new BSTDS(10);
		BSTDS rightNode= new BSTDS(100);
		root.leftchild=leftNode;
		root.rightChild=rightNode;
		
		root.insert(root, 1000);
		root.insert(root, 88);
		System.out.println("in order traversal");
		root.inOrderTraversal(root);
		System.out.println("Post order traversal");

		root.postOrderTraversal(root);
		System.out.println("Pre order traversal");

		root.preOrderTraversal(root);

		System.out.println("Search for 100 results "+root.search(root, 100));
		System.out.println("Search for 999 results "+root.search(root, 999));

	}

}
