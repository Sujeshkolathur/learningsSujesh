package DSA;

public class BSTDS extends Node{

	public BSTDS(Integer data) {
		super(data);
		// TODO Auto-generated constructor stub
	}

	public Node insert(Node node, int data) {
		if(node==null) {
			node= new BSTDS(data);
		}else {
			if(data<=node.data) {
				node.leftchild=insert(node.leftchild, data);
			}else {
				node.rightChild=insert(node.rightChild, data);
			}
		}
		
		return node;
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
	
	public boolean search(Node root, int value) {
		boolean found=false;
		
		while(found==false && root!=null) {
			if(root.data<value)
				root= root.rightChild;
			else if(root.data>value)
				root=root.rightChild;
			else 
			{
				found= true;
				return found;
			}
		}
		
		return found;
		
	}

}
