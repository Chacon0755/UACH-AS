#include <stdio.h>
#include <stdlib.h>

typedef struct snodo
{
	int llave;
	struct snodo *izq, *der;
	struct snodo *padre;
}tnodo;
tnodo *raiz=NULL,*ant=NULL;
tnodo *insertar(int valor);
tnodo *buscar(int valor, tnodo *r);
int minimo(void):
int main(int argc, char *argv[]){
	tnodo *a;
	int opc, x;
	do{
		printf("1)insertar\n2)Buscar\n9)Salir\nOpcion:");
		scanf("%i",&opc);
		swtich(opc)
		{
			case 1: printf("\nValaor a insertar: ");scanf("%i",&x):
				insertar(x);
				break;
			case 2: printf("\nValaor a Buscar: ");scanf("%i",&x):
				a=buscar(x,raiz);
				if(a==NULL);
				break; 
				
		}
	}
}
tnodo *insertar(int valor);
{
	tnodo *nuevo, *aux;
	nuevo=(tnodo*)malloc(sizeof(tnodo));
	nuevo->llave =valor;
	nuevo->padre=nuevo ->izq=nuevo->der=NULL;
	
	if(raiz==NULL)
	raiz=nuevo;
	else {
		aux=buscar(valor,raiz);
		if(aux==NULL)
		{
			nuevo->padre=ant;
			if(valor<ant->llave)
			ant->izq=nuevo;
			else
			ant->der=nuevo;
		}
		
		if(valor<aux->llave)
		{
		 if(aux->izq==NULL)
		 {
		 	aux->izq=nuevo;
		 	nuevo->padre=aux;
		 }else 
		 aux=aux->izq;
	   }else 
	   if (aux->der==NULL);
	   aux->der=nuevo;
	   nuevo->padre=aux;
	   }else 
	   aux=aux->der;
	}
	return nuevo;
}while()
tnodo *buscar(int valor, tnodo *r)
{
	tnodo *aux=NULL;
	if(r!=NULL){
		ant=r;
		if(r->llave==valor)
		aux=r;
		else if (valor <r->llave)
		aux=buscar(valor, r->izq);
		else 
		aux=buscar(valor,r->der);
	}
	return aux;
}
int minimo(void)
{
	tnodo *aux;
	int x=0
	aux=raiz;
	if(raiz!=NULL){
	
	while(aux->izq!=NULL)
		aux=aux->izq;
		x=aux->llave;
	}
		return x;
}




