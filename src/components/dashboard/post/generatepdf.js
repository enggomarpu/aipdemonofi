import React , { PureComponent } from "react"

import jsPDF from "jspdf"

export default class pdfGenerator extends PureComponent {

    constructor (props) {
        super (props)
        
        this.state = {
            
        }
    }

    generatePDF = () => {
        var doc = new jsPDF('p', 'pt');
        
        doc.text(20, 20, 'This is the first title.')
  
        doc.setFont('helvetica')
      //  doc.setFontType('normal')
        doc.text(20, 60, 'This is the second title.')
  
        doc.setFont('helvetica')
      //  doc.setFontType('normal')
        doc.text(20, 100, 'This is the thrid title.')      
  
        
        doc.save('demo.pdf')
      }   
    render() {

        return(<button onClick= {this.generatePDF}>PDF GENERATE</button>)
    }
}